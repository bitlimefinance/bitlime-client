
import { readSmartContract } from "./web3";
import abi from "./abis/erc20.json" assert {type: 'json'};

export const ERC20_ABI: Array<any> = abi;

export const decimals = async (args: {
    tokenAddress: string,
}) => {
    return await readSmartContract({
        abi: abi,
        address: args.tokenAddress,
        methodName: 'decimals',
        methodParams: []
    })
    .then((data) => {
        return data;
    })
    .catch((err) => {
        // console.error(err);
    });
};

export const allowance = async (args: {
    address: string,
    spender: string,
    tokenAddress: string,
}) => {
    return await readSmartContract({
        abi: abi,
        address: args.tokenAddress,
        methodName: 'allowance',
        methodParams: [args.address, args.spender]
    })
    .then((data) => {
        return data;
    })
    .catch((err) => {
        // console.error(err);
    });
};

export const balanceOf = async (args: {
    address: string,
    tokenAddress: string,
}) => {
    return await readSmartContract({
        abi: abi,
        address: args.tokenAddress,
        methodName: 'balanceOf',
        methodParams: [args.address]
    })
    .then((data) => {
        return data;
    })
    .catch((err) => {
        // console.error(err);
    });
};
