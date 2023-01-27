import { metamaskAccounts } from "$lib/core/sdk/eip-1193";
import { isIterable } from "$lib/core/utils/utilities";
import { get, writable, type Writable } from "svelte/store";
import { _WALLETS } from "$lib/globals";
import { isConnectedToWallet } from "$lib/core/sdk/eip-1193";
import { getLatestBlock } from "$lib/core/sdk/web3/utils/block/lib";

export const init: Writable<boolean> = writable(false);

export const connected: Writable<_WALLETS> = writable();
export const setConnected = (wallet: _WALLETS) => {
    connected.set(wallet);
}

export const accounts: Writable<string[]> = writable([]);
export const setAccounts = async () => {
    try {
        if (await isConnectedToWallet()) {
            latestBlock.set(await getLatestBlock());
            const allAccounts: Array<any> = [get(metamaskAccounts)];
            let list: any = [];
            for (const iterator of allAccounts) {
                if(isIterable(iterator)){
                    list = [...list, ...iterator];
                } else {
                    list = [...list, iterator];
                }
            }
            if(list && list.length > 0) accounts.set(list);
        } else {
            connected.set(_WALLETS.DISCONNECTED);
        }
    } catch (error) {
        console.error(error);
    }
};

export const encBlw: Writable<string> = writable(''); // encrypted blw

export const latestBlock: Writable<string> = writable('');

export const showConnenct: Writable<boolean> = writable(false);

export const selectNetwork: Writable<boolean> = writable(false);
export const selectedNetwork: Writable<any> = writable({});
export const networkCoin: Writable<any> = writable({});

export const tokensList: Writable<any[]> = writable([]);
export const chainsList: Writable<any[]> = writable([]);

export const autoSlippage: Writable<boolean> = writable(true);
export const slippageStore: Writable<number> = writable(0.1);
export const deadlineStore: Writable<number> = writable(20);