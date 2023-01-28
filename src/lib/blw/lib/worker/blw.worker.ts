import { debug, debugError, debugTime, debugTimeEnd } from "$lib/core/utils/debug";
import unlockWallet from "../unlockWallet";
import { Action, type ToWorkerMessage, type FromWorkerMessage } from "./types";
import { decryptCipherText, encryptMessage } from "$lib/core/utils/cipher/passworder";
import { fromMnemonic } from "$lib/core/sdk/web3/wallet/lib";

let wallet: any;
let accessToken: string;
let suid: string;
let response: FromWorkerMessage | null;

onmessage = async function (e) {
        try {  
                debug('Worker onmessage', e);
                if(!e.data) return;
                const data: ToWorkerMessage = JSON.parse(e?.data) as ToWorkerMessage;
                const { action, payload } = data;
                if(!action) throw new Error('Could not execute worker: action undefined');
                suid = payload?.suid || suid;
                response = null;
                switch (action) {
                        case Action.UNLOCK:{
                                debugTime('Worker initialization');
                                accessToken = payload?.accessToken;
                                let psw = payload?.password;
                                if(!accessToken||!psw) throw new Error('Could not initialize worker');
                                let encVault = JSON.parse(await unlockWallet(accessToken, suid));
                                let vault =  JSON.parse(await decryptCipherText(encVault, psw));
                                if(!vault?.mnemonic) throw new Error('Could not initialize worker');
                                wallet = await fromMnemonic(vault.mnemonic);
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
                                accessToken = payload?.accessToken;
                                suid = payload?.suid || '';
                                let mnemonic = payload?.secretPhrase;
                                const psw = payload?.password;
                                if(!mnemonic) throw new Error('Could not import wallet');
                                wallet = await fromMnemonic(mnemonic);
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
                                debug('Address', await wallet.address);
                                debugTimeEnd('Get address');
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