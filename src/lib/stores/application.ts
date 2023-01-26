import { metamaskAccounts } from "$lib/core/sdk/eip-1193";
import { isIterable } from "$lib/core/utils/utilities";
import { get, writable } from "svelte/store";
import { _WALLETS } from "$lib/globals";
import { isConnectedToWallet } from "$lib/core/sdk/eip-1193";

export const init = writable(false);

export const connected = writable();
export const setConnected = (wallet: _WALLETS) => {
    connected.set(wallet);
}

export const accounts = writable([]);
export const setAccounts = async () => {
    try {
        if (await isConnectedToWallet()) {
            latestBlock.set(await window.ethereum.request({ method: 'eth_blockNumber' }));
            const allAccounts: Array<any> = [get(metamaskAccounts)];
            let list: any = [];
            for (const iterator of allAccounts) {
                if(isIterable(iterator)){
                    list = [...list, ...iterator];
                } else {
                    list = [...list, iterator];
                }
            }
            accounts.set(list);
        } else {
            connected.set(_WALLETS.DISCONNECTED);
        }
    } catch (error) {
        console.error(error);
    }
};

export const encBlw = writable(''); // encrypted blw

export const latestBlock = writable('');

export const showConnenct = writable(false);

export const selectNetwork = writable(false);
export const selectedNetwork = writable({});
export const networkCoin = writable({});

export const tokensList = writable([]);
export const chainsList = writable([]);

export const autoSlippage = writable(true);
export const slippageStore = writable(0.1);
export const deadlineStore = writable(20);