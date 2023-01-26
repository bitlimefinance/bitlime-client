import { debug, debugError, debugTime, debugTimeEnd } from "$lib/core/utils/debug";
import { Wallet } from "ethers";
import unlockWallet from "../unlockWallet";
import { Action, type ToWorkerMessage } from "./types";
import { decryptCipherText } from "$lib/core/utils/cipher/passworder";

let wallet: any;
let pk: string;
let suid: string;

onmessage = async function (e) {
        try {  
                debug('Worker onmessage', e);
                if(!e.data) return;
                const data: ToWorkerMessage = JSON.parse(e?.data) as ToWorkerMessage;
                const { action, payload } = data;
                if(!action) throw new Error('Could not execute worker: action undefined');
                switch (action) {
                        case Action.INIT:{
                                debugTime('Worker initialization');
                                pk = payload?.pk;
                                suid = payload?.suid || '';
                                let psw = payload?.password;
                                if(!pk||!psw) throw new Error('Could not initialize worker');
                                let encVault = JSON.parse(await unlockWallet(pk, suid));
                                let vault =  JSON.parse(await decryptCipherText(encVault, psw));
                                if(!vault?.mnemonic) throw new Error('Could not initialize worker');
                                wallet = Wallet.fromMnemonic(vault.mnemonic);
                                psw = vault = encVault = null;
                                debugTimeEnd('Worker initialization');
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
        }
};

export {};