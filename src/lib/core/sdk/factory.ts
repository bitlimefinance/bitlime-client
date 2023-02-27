

import { debugError } from "../utils/debug";
import abi from "./abis/factory.json" assert {type: 'json'};
import { LMC_ADDRESS } from "./lime";
import { getNativeToken } from "./router";
import { readSmartContract } from "./web3/contracts/lib";
import { validateAddresses } from "./web3/utils/addresses/lib";
import { constants } from "ethers";
import { get } from "svelte/store";

export const FACTORY_ADDRESS: Readonly<string> = '0x60D1A84F61D63632380f03d246669B55dd00bc4E';
export const FACTORY_ABI: any[] = abi;

export const getPair = async (args: {
    tokenAddressA: string,
    tokenAddressB: string,
}) => {
    const { tokenAddressA, tokenAddressB } = args;
    if (!tokenAddressA || !tokenAddressB) return null;
    if (!await validateAddresses([tokenAddressA, tokenAddressB])) return null;
    const pair =  await readSmartContract({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        methodName: 'getPair',
        methodParams: [tokenAddressA, tokenAddressB],
    });
    if (pair && pair!==constants.AddressZero) return pair;
    return null;
}

export const checkIfPathExists = async (tokenAddressA: string, tokenAddressB: string): Promise<boolean> => {
    try {
        const nativeToken = await getNativeToken();
        const tokenA = tokenAddressA == "native" ? nativeToken : tokenAddressA;
        const tokenB = tokenAddressB == "native" ? nativeToken : tokenAddressB;
        const directPair = await getPair({tokenAddressA: tokenA, tokenAddressB: tokenB});
        if(directPair) return true;
        const intermediatePairA = await getPair({tokenAddressA: tokenA, tokenAddressB: LMC_ADDRESS});
        const intermediatePairB = await getPair({tokenAddressA: LMC_ADDRESS, tokenAddressB: tokenB});
        if(intermediatePairA && intermediatePairB) return true;
        return false;
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const allPairsLength = async () => {
    return await readSmartContract({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        methodName: 'allPairsLength',
        methodParams: [],
    });
}

export const allPairs = async (args: {
    index: string,
}) => {
    const { index } = args;
    if (!index) return null;
    return await readSmartContract({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        methodName: 'allPairs',
        methodParams: [index],
    });
}