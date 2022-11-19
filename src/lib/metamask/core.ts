import { _WALLETS } from '$lib/globals';
import type { TransactionParameters } from '$lib/interfaces';
import { setConnected } from '$lib/stores/application';
import { tick } from 'svelte';
import { writable } from 'svelte/store'

export const metamaskAccounts = writable([]);

export function ethereumSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }
  
export function metamaskInstalled(): boolean {
    if (ethereumSupported()) {
        if (window.ethereum.isMetaMask) {
            return true;
        }
    }
    return false;
}

export const connectMetamask = async () => {
    try {
        if(metamaskInstalled()){
            let connectedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            metamaskAccounts.set(connectedAccounts);
            await tick();
            setConnected(_WALLETS.METAMASK);
        }else{
            console.log('Metamask not installed');
        }
    } catch (error) {
        console.error(error);
    }
}


export const sendTransactionMetamask = async (params: TransactionParameters) => {
    try {
        const transactionParameters = {
            to: params.to,
            from: params.from,
            value: params.value,
            gasPrice: params.gasPrice,
            gas: params.gas,
            data: params.data,
            chainId: params.chainId,
            nonce: params.nonce,
        };
        
        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        console.log(txHash);
    } catch (error) {
        console.error(error);      
    }
};
