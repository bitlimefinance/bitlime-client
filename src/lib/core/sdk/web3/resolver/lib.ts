import { debugError } from "$lib/core/utils/debug";
import { isAddress } from "ethers/lib/utils";
import { web3Provider } from "../provider/lib";


export const lookupAddress = async (address: string) => {
    try {
        const res = await web3Provider.lookupAddress(address);
        return res;
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const resolveName = async (name: string) => {
    try {
        const res = await web3Provider.resolveName(name);
        return res;
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const getResolver = async (name: string) => {
    try {
        const res = await web3Provider.getResolver(name);
        return res;
    } catch (error) {
        debugError(error);
        return null;
    }
}