import type { GetTransactionObject } from "$lib/interfaces";
import Web3 from "web3";

export const loadWeb3 = async (rpc: string) => {
    try {
        let web3Instance = new Web3(rpc || window?.bl_rpc || 'https://rpc.ankr.com/eth');
        window.web3 = web3Instance;
    } catch (error) {
        console.error(error);
    }
}

export const loadContract = async (abi: any, address: string) => {
    return await new window.web3.eth.Contract(abi, address);
}

export const getTransactionObject = async (args: GetTransactionObject) => {
    console.log(args);
    
    let txObj;
    try {
        if (!window.web3) await loadWeb3(window.bl_rpc);
        let contract = await loadContract(args.abi, args.address);
        txObj = contract.methods[args.methodName](...args.methodParams);
    } catch (error) {
        console.error(error);
    } finally {
        return txObj;
    }
}

export const readSmartContract = async (args: {
    abi: Array<any>,
    address: string,
    methodName: string,
    methodParams: Array<any>,
}) => {
    let result;
    try {
        if (!window.web3) await loadWeb3(window.bl_rpc);
        let contract = await loadContract(args.abi, args.address);
        result = await contract.methods[args.methodName](...args.methodParams).call();
    } catch (error) {
        console.error(error);
    } finally {
        return result;
    }
}

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const isConnected = async () => {
    let connected: boolean = false;
    if (window?.ethereum) {
        connected = Boolean(window.ethereum.isConnected());
        if (!connected) return false;
        let ethAccounts = await window.ethereum?.request({ method: 'eth_accounts' });
        if(ethAccounts && ethAccounts.length && ethAccounts.length > 0) connected = true;
    }
    return connected;
}