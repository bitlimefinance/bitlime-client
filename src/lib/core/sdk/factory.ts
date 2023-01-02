

import abi from "./abis/factory.json" assert {type: 'json'};
import { ADDRESS_0, isAddress, readSmartContract, validateAddresses } from "./web3";

export const FACTORY_ADDRESS: Readonly<string> = '0x60D1A84F61D63632380f03d246669B55dd00bc4E';
export const FACTORY_ABI: Array<any> = abi;

export const getPair = async (args: {
    tokenAddressA: any,
    tokenAddressB: any,
}) => {
    const { tokenAddressA, tokenAddressB } = args;
    if (!tokenAddressA || !tokenAddressB) return null;
    if (!await validateAddresses([tokenAddressA, tokenAddressB])) return null;
    let pair =  await readSmartContract({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        methodName: 'getPair',
        methodParams: [tokenAddressA, tokenAddressB],
    });
    if (pair && pair!==ADDRESS_0) return pair;
    return null;
}