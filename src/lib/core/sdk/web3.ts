import type { GetTransactionObject } from "$lib/interfaces";
import Web3 from "web3";

export const loadWeb3 = async (rpc: string) => {
    try {
        if(window.ethereum) window.web3 = new Web3(window.ethereum);
        else window.web3 = new Web3(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
    } catch (error) {
        console.error(error);
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

export const getBalance = async (address: string) => {
    if (!window.web3) await loadWeb3(window.bl_rpc);
    return await window.web3.eth.getBalance(address)
    .then((data) => {
        return data;
    })
    .catch((err) => {
        console.error(err);
    });
}

export const noOfDecimalsToUnits = (decimals: number = 18) => {
    let decimalsString = decimals.toString();
    let unitMap: any = {
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