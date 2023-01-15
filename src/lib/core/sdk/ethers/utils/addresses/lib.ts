import { web3Provider } from "$lib/core/sdk/web3";
import { debugError } from "$lib/core/utils/debug";
import { ethers } from "ethers";

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const isAddress = async (address: string) => {
    try {
        return ethers.utils.isAddress(address);
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const validateAddresses = async (addresses: Array<string>) => {
    try {
        let valid: boolean = true;
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            if (!await isAddress(address)) {
                valid = false;
                throw new Error(`Invalid address: ${address}`);
            }
        }
        return valid;
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const getAddressBalance = async (address: string) => {
    txPreflight(false, [address]);
    let res = await web3Provider.getBalance(address);
    return res;
}