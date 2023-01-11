import type { GetTransactionObject } from "$lib/core/descriptors/interfaces";
import { ethers } from "ethers";
import type { EtherUnit } from "../descriptors/types";
import { writable } from "svelte/store";
import { debug, debugError } from "../utils/debug";

export const web3Ready_ = writable(false);

export const ADDRESS_0: Readonly<string> = "0x0000000000000000000000000000000000000000";

export let web3Provider: any;
export let web3Signer: any;

export const loadWeb3 = async (rpc?: string) => {
    try {
        if(window.ethereum) web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        else web3Provider = new ethers.providers.JsonRpcProvider(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
        web3Ready_.set(true);
    } catch (error) {
        debugError(error);
    }
}

export const setSigner = async (provider: any = web3Provider) => {
    web3Signer = provider.getSigner();
};

export const isAddress = async (address: string) => {
    try {
        return await ethers.utils.isAddress(address);
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


export const loadContractReadOnly = async (abi: any, address: string) => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    return new ethers.Contract(address, abi).connect(web3Provider);
}

export const loadContract = async (abi: any, address: string, signer: any = web3Signer) => {
    return new ethers.Contract(address, abi, signer);
}

export const getTransactionObject = async (args: GetTransactionObject) => {
    //console.log(args);
    let txObj;
    try {
        let { abi, address, methodName, methodParams } = args;
        if (!web3Provider) await loadWeb3(window.bl_rpc);
        let contract = await loadContract(abi, address);
        txObj = contract.functions[args.methodName](...args.methodParams);
    } catch (error) {
        debugError(error);
    } finally {
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
        if (!web3Provider) await loadWeb3(window.bl_rpc);
        let contract = await loadContractReadOnly(args.abi, args.address);
        result = await contract.functions[args.methodName](...args.methodParams);
    } catch (error) {
        debugError(error);
    } finally {
        return result;
    }
}

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const getBalance = async (address: string) => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    let res = await web3Provider.getBalance(address);
    return res;
}

export const noOfDecimalsToUnits = (decimals: number = 18) => {
    let decimalsString = decimals.toString();
    let unitMap: {
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
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    const gas = await web3Provider.getGasPrice();
    return gas;
}

export const getLatestBlock = async () => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    const gas = await web3Provider.getBlockNumber();
    return gas;
}


export const estimateGas = async (data: any, from: string, value: string) => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    const gas = await web3Provider.estimateGas({ data, from, value, gasPrice: await getGasPrice() });
    return await gas.toString();
}

export const toWei = (amount: string, unit: EtherUnit | null) => {
    try {
        return ethers.utils.parseUnits(amount, unit || 'ether').toString(); // type: string | null
    } catch (error) {
        debugError(error);
        return null;  
    }
}