

import abi from "./abis/factory.json" assert {type: 'json'};
import { readSmartContract } from "./web3/contracts/lib";
import { validateAddresses } from "./web3/utils/addresses/lib";
import { constants } from "ethers";

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