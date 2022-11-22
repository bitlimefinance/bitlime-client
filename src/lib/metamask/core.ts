import { _contracts } from '$lib/contractsReference';
import { getTransactionObject } from '$lib/core/web3Manager';
import { _WALLETS } from '$lib/globals';
import type { TransactionParameters } from '$lib/interfaces';
import { setConnected } from '$lib/stores/application';
import { tick } from 'svelte';
import { get, writable } from 'svelte/store'

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


export const swapExactTokensForTokens = async (args: {
    amount: number,
    decimals: number,
    amountOutMin: number,
    path: Array<string>,
    to: string,
    deadline: number,
    affiliateAddress: string,
}) => {
    getTransactionObject({
        abi: _contracts.router.abi,
        address: _contracts.router.address,
        methodName: '0x05a1450d',
        methodParams: [
            (args.amount*Math.pow(10,args.decimals)), // amountIn
            args.amountOutMin, // amountOutMin
            args.path, // path
            args.to, // to
            args.deadline, // deadline
            args.affiliateAddress // affiliateAddress
        ],
    })
    .then(async (data)=>{
        await sendTransactionMetamask({
            to: _contracts.router.address,
            from: args.to,
            value: null,
            data: data?.encodeABI(),
            chainId: null,
            gasPrice: null,
            gas: null,
            nonce: null
        });
    })
    .catch((err)=>{
        console.log(err);
    });
}


export const erc20Approve = async (args: {
    address: string,
    amount: number,
    tokenAddress: string,
    decimals: number,
    ownerAddress: string,
}) => {
    getTransactionObject({
        abi: _contracts.erc20.abi,
        address: args.tokenAddress,
        methodName: 'approve',
        methodParams: [
            args.address, // spender
            (args.amount*Math.pow(10,args.decimals)), // amount
        ],
    })
    .then(async (data)=>{
        await sendTransactionMetamask({
            to: args.tokenAddress,
            from: args.ownerAddress,
            value: null,
            data: data?.encodeABI(),
            chainId: null,
            gasPrice: null,
            gas: null,
            nonce: null
        });
    })
    .catch((err)=>{
        console.log(err);
    });
}