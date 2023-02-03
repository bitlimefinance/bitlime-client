import type { GetTransactionObject } from "$lib/core/descriptors/interfaces";
import Web3 from "web3";
import type { EtherUnit } from "../descriptors/types";
import { writable } from "svelte/store";
import { debug, debugError } from "../utils/debug";

export const web3Ready_ = writable(false);

export const ADDRESS_0: Readonly<string> = "0x0000000000000000000000000000000000000000";

export const isAddress = async (address: string) => {
    try {
        return await window.web3.utils.isAddress(address);
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const validateAddresses = async (addresses: Array<string>) => {
    let valid = true;
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        if (!await isAddress(address)) {
            valid = false;
            break;
        }
    }
    return valid;
}

export const loadWeb3 = async (rpc: string) => {
    try {
        if(window.ethereum) window.web3 = new Web3(window.ethereum);
        else window.web3 = new Web3(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
        web3Ready_.set(true);
    } catch (error) {
        debugError(error);
    }
}

export const loadContract = async (abi: any, address: string) => {
    return await new window.web3.eth.Contract(abi, address);
}

export const getTransactionObject = async (args: GetTransactionObject) => {
    //console.log(args);
    let txObj;
    try {
        if (!window.web3) await loadWeb3(window.bl_rpc);
        let contract = await loadContract(args.abi, args.address);
        txObj = contract.methods[args.methodName](...args.methodParams);
        return txObj;
    } catch (error) {
        debugError(error);
        return txObj;
    }
}

export const readSmartContract = async (args: {
    abi: any[],
    address: string,
    methodName: string,
    methodParams: Array<any>,
}) => {
    let result;
    try {
        if (!window.web3) await loadWeb3(window.bl_rpc);
        let contract = await loadContract(args.abi, args.address);
        result = await contract.methods[args.methodName](...args.methodParams).call();
        return result;
    } catch (error) {
        debugError(error);
        return result;
    }
}

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const getBalance = async (address: string) => {
    if (!window.web3) await loadWeb3(window.bl_rpc);
    return await window.web3.eth.getBalance(address)
    .then((data) => {
        return data;
    })
    .catch((err) => {
        debugError(err);
    });
}

export const noOfDecimalsToUnits = (decimals = 18) => {
    const decimalsString = decimals.toString();
    const unitMap: {
        [key: string]: Array<EtherUnit>
    } = {
        '0': ['noether'],
        '1': ['wei'],
        '3': ['kwei', 'Kwei', 'babbage', 'femtoether'],
        '6': ['mwei', 'Mwei', 'lovelace', 'picoether'],
        '9': ['gwei', 'Gwei', 'shannon', 'nanoether', 'nano'],
        '12': ['szabo', 'microether', 'micro'],
        '15': ['finney', 'milliether', 'milli'],
        '18': ['ether'],
        '21': ['kether', 'grand'],
        '24': ['mether'],
        '27': ['gether'],
        '30': ['tether']
    };
    
    if(unitMap[decimalsString]) return unitMap[decimalsString][0];
    else return null;
}

export const getGasPrice = async () => {
    const gas = await window?.web3.eth.getGasPrice();
    return await gas.toString();
}


export const estimateGas = async (txObj: any, from: string, value: string) => {
    const gas = await txObj.estimateGas({ from: from, value: value, gasPrice: await getGasPrice() });
    return await gas.toString();
}