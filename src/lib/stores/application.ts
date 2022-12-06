import { metamaskAccounts } from "$lib/metamask/core";
import { isIterable } from "$lib/core/utils/utilities";
import { get, writable } from "svelte/store";
import { _WALLETS } from "$lib/globals";
import { isConnected } from "$lib/core/web3Manager";
import { getTokensList } from "$lib/core/contents/apis";

export const connected = writable();
export const setConnected = (wallet: _WALLETS) => {
    connected.set(wallet);
}

export const accounts = writable([]);
export const setAccounts = async () => {
    try {
        if (await isConnected()) {
            latestBlock.set(await window.ethereum.request({ method: 'eth_blockNumber' }));
            let allAccounts: Array<any> = [get(metamaskAccounts)];
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

export const latestBlock = writable('');

export const showConnenct = writable(false);

export const selectNetwork = writable(false);
export const selectedNetwork = writable({});

export const tokensList = writable([]);
export const chainsList = writable([]);

export const init = writable(false);