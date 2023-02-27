import { debug, debugError, debugTime, debugTimeEnd } from "$lib/core/utils/debug";
import unlockWallet from "../unlockWallet";
import { Action, type ToWorkerMessage, type FromWorkerMessage, type TxInfo } from "./types";
import { decryptCipherText, encryptMessage } from "$lib/core/utils/cipher/passworder";
import { fromMnemonic } from "$lib/core/sdk/web3/wallet/lib";
import { Wallet, ethers } from "ethers";
import { web3Provider, setProvider } from "$lib/core/sdk/web3/provider/lib";
import { fromBigNumber } from "$lib/core/sdk/web3/utils/bigNumber/lib";
import { getGasPrice } from "$lib/core/sdk/web3/utils/feeData/lib";

let wallet: any;
let suid: string;
let response: FromWorkerMessage | null;

onmessage = async (e): Promise<void> => {
        try {  
                debug('Worker onmessage', e);
                if(!e.data) return;
                const data: ToWorkerMessage = JSON.parse(e?.data) as ToWorkerMessage;
                const { action, payload } = data;
                if(!action) throw new Error('Could not execute worker: action undefined');
                const net = payload?.network;
                if(net) await setProvider(net?.rpc, true);
                suid = payload?.suid || suid;
                response = null;
                switch (action) {
                        case Action.UNLOCK:{
                                debugTime('Worker initialization');
                                const accessToken = payload?.accessToken;
                                let psw = payload?.password;
                                if(!accessToken||!psw) throw new Error('Could not initialize worker');
                                let encVault = JSON.parse(await unlockWallet(accessToken, suid));
                                let vault =  JSON.parse(await decryptCipherText(encVault, psw));
                                if(!vault?.mnemonic) throw new Error('Could not initialize worker');
                                const w = await fromMnemonic(vault.mnemonic);
                                if(!w) throw new Error('Could not initialize worker');
                                wallet = new Wallet(w, web3Provider);
                                psw = vault = encVault = null;
                                response = {
                                        action: Action.UNLOCK,
                                        error: false,
                                        payload: {
                                                address: wallet?.address || '',
                                        }
                                };
                                debugTimeEnd('Worker initialization');
                                break;
                        }
                        case Action.IMPORT:{
                                debugTime('Import wallet');
                                suid = payload?.suid || '';
                                let mnemonic = payload?.secretPhrase;
                                const psw = payload?.password;
                                if(!mnemonic) throw new Error('Could not import wallet');
                                const w = await fromMnemonic(mnemonic);
                                if(!w) throw new Error('Could not import wallet');
                                wallet = new Wallet(w, web3Provider);
                                const publicKey = wallet?._signingKey()?.publicKey || '';
                                const vault = await encryptMessage(JSON.stringify({mnemonic, publicKey}) || '', psw);
                                mnemonic = null;
                                response = {
                                        action: Action.IMPORT,
                                        error: false,
                                        payload: {
                                                publicKey,
                                                vault,
                                                address: wallet?.address || ''
                                        }
                                };
                                debugTimeEnd('Import wallet');
                                break;
                        }
                        case Action.GET_ADDRESS:{
                                debugTime('Get address');
                                response = {
                                        action: Action.GET_ADDRESS,
                                        error: false,
                                        payload: {
                                                address: await wallet.address,
                                        }
                                };
                                debugTimeEnd('Get address');
                                break;
                        }
                        // case Action.TX_PREVIEW:{
                        //         debugTime('Transaction preview');
                        //         const { address, value, methodName, abi, methodParams } = payload as {[key: string]: any};
                        //         // const contract = new ethers.Contract(address, abi, wallet);
                        //         // const blwGasEstimate = await contract.estimateGas[methodName](...methodParams);
                        //         response = {
                        //                 action: Action.TX_PREVIEW,
                        //                 error: false,
                        //                 payload: {
                        //                         to: address,
                        //                         methodName,
                        //                         value,
                        //                         estimatedGas: '0',
                        //                         chainId: (net?.id || '1').toString(),
                        //                 }
                        //         };
                        //         debugTimeEnd('Transaction preview');
                        //         break;
                        // }
                        case Action.ESTIMATE_GAS:{
                                debugTime('Estimate gas');
                                const { address, value, methodName, abi, methodParams } = payload as {[key: string]: any};
                                const gasPrice = await getGasPrice() || '0';
                                // Connect to the contract
                                const contract = new ethers.Contract(address, abi, wallet);
                                
                                // Estimate the gas needed for the transaction
                                const gasEstimate = await contract.estimateGas[methodName](...methodParams, { value, gasLimit: (gasPrice + 500000).toString() });

                                response = {
                                        action: Action.ESTIMATE_GAS,
                                        error: false,
                                        payload: {
                                                gasEstimate
                                        }
                                }

                                debugTimeEnd('Estimate gas');
                                break;
                        }
                        // case Action.GET_SIGNER:{
                        //         if(!Signer.isSigner(wallet)) throw new Error('Could not get signer');
                        //         response = {
                        //                 action: Action.GET_SIGNER,
                        //                 error: false,
                        //                 payload: {
                        //                         signer: JSON.stringify(wallet)
                        //                 }
                        //         };
                        //         break;
                        // }
                        case Action.TX_SEND:{
                                debugTime('Send transaction');
                                const txInfo = payload as TxInfo;
                                if(!(txInfo?.contractInfo?.address && txInfo?.contractInfo?.abi && txInfo?.methodName && txInfo?.methodParams)) throw new Error("Something went wrong.");

                                const contract = new ethers.Contract(txInfo.contractInfo.address, txInfo.contractInfo.abi, wallet);

                                const gas = fromBigNumber(txInfo.estimatedGas || 0) || "0";

                                const tx = await contract.functions[txInfo.methodName](...txInfo.methodParams, {
                                        value: txInfo?.value || '0',
                                        gasLimit: gas
                                });
                                const receipt = JSON.stringify(await tx.wait()); // Wait for transaction to be mined
                                const txHash = tx.hash;
                                response = {
                                        action: Action.TX_SEND,
                                        error: false,
                                        payload: {
                                                txHash,
                                                receipt
                                        }
                                }
                                debugTimeEnd('Send transaction');
                                break;
                        }
                        default:{
                                // do nothing
                                break;
                        }
                }
        } catch (error) {
                debugError(error);
                response = {
                        action: Action.ERROR,
                        error: true,
                        payload: {
                                error: error,
                        }
                };
        } finally {
                debug('Worker response', response);
                if(response) postMessage(response);
        }
};

export {};