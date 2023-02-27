import { _contracts } from '$lib/contractsReference';
import { _WALLETS } from '$lib/globals';
import type { TransactionParameters } from '$lib/core/descriptors/interfaces';
import { writable } from 'svelte/store'
import type { ProviderEvent } from '$lib/core/descriptors/types';

export const metamaskAccounts = writable([]);

export function ethereumSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

export const isConnectedToRPC = async () => {
    return ethereumSupported() && await window.ethereum.isConnected()
};

export const isConnectedToWallet = async () => {
    let connected = false;
    try {
        if (window && window?.ethereum) {
            connected = Boolean(window.ethereum.isConnected());
            if (!connected) return false;
            const ethAccounts = await window.ethereum?.request({ method: 'eth_accounts' });
            if(ethAccounts && ethAccounts.length && ethAccounts.length > 0) connected = true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        return connected;
    }
}

export const sendTransaction = async (params: TransactionParameters) => {
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
        return txHash;
    } catch (error) {
        console.error(error);
        return null;
    }
};



export async function switchEthereumChain(chainId: string) {
    if(!ethereumSupported()) return;
    return await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId
      }]
    })
  }  

export async function addEthereumChain(
    chainId: string,
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    iconUrls: string[],
    blockExplorerUrls: string[],    
) {
    if(!ethereumSupported()) return;
    const params = [{
        chainId: chainId,
        chainName: chainName,
        nativeCurrency: nativeCurrency,
        rpcUrls: rpcUrls,
        iconUrls: iconUrls,
        blockExplorerUrls: blockExplorerUrls
    }]
    return await window.ethereum.request({ method: 'wallet_addEthereumChain', params })
}

export async function ethSign(message: string) {
    if(!ethereumSupported()) return;
    const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.warn('No accounts allowed')
      return;
    }
    const from = accounts[0]
    const msg = message
    const params = [from, msg]
    return await window.ethereum.request({
      method: 'eth_sign',
      params
    })  
}

  
export async function personalSign(message: string) {
    if(!ethereumSupported()) return;
    const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.warn('No accounts allowed')
      return;
    }
    const from = accounts[0]
    const msg = message
    const params = [msg, from]
    return await window.ethereum.request({
      method: 'personal_sign',
      params
    })  
}

export async function signTypedDataV3(message: Object) {
    if(!ethereumSupported()) return;
    const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
        console.log('No accounts allowed')
        return
    }
    const from = accounts[0]
    const params = [from, JSON.stringify(message)]
    return await window.ethereum.request({
        method: 'eth_signTypedData_v3',
        params
    }) 
}

export async function signTypedDataV4(message: Object) {
    if(!ethereumSupported()) return;
    const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
        console.log('No accounts allowed')
        return
    }
    const from = accounts[0]
    const params = [from, JSON.stringify(message)]
    return await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params
    }) 
}



// EVENTS

export const subscribeToEvent = async (event: ProviderEvent, callBack: Function) => {
    try {
        if(!ethereumSupported()) return;
        window.ethereum.on(event, (connectInfo: any) => {
            callBack();
        });
    } catch (error) {
        console.warn(error);
    }
}

export const unsubscribeFromEvent = async (event: ProviderEvent, callBack: Function) => {
    try {
        if(!ethereumSupported()) return;
        window.ethereum.off(event, (connectInfo: any) => {
            callBack();
        });
    } catch (error) {
        console.warn(error);
    }
}

