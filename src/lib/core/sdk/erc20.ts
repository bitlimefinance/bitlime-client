
import abi from "./abis/erc20.json" assert {type: 'json'};
import { debug, debugError } from "../utils/debug";
import { get } from "svelte/store";
import { selectedNetwork } from "$lib/stores/application";
import { interactWithContract, readSmartContract } from "./web3/contracts/lib";
import { getAddressBalance } from "./web3/utils/addresses/lib";
import { fromBigNumber } from "./web3/utils/bigNumber/lib";

export const ERC20_ABI: any[] = abi;

export const decimals = async (args: {
    tokenAddress: string,
}) => {
    try{
        if(args.tokenAddress === 'native') return get(selectedNetwork)?.decimals || 18;
        else {
            const res = await readSmartContract({
                abi: abi,
                address: args.tokenAddress,
                methodName: 'decimals',
                methodParams: []
            });
            return res;
        }
    } catch (error) {
        debugError(error);
        return null;
    }
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
        debugError(err);
    });
};

export const balanceOf = async (args: {
    address: string,
    tokenAddress: string,
}) => {
    try {
        if(!args.address || !args.tokenAddress) return 0;
        let res: any = 0;
        switch(args.tokenAddress){
            case 'native' || '':
                res = await getAddressBalance(args.address);
                break;
            default:
                res = await readSmartContract({
                    abi: ERC20_ABI,
                    address: args.tokenAddress,
                    methodName: 'balanceOf',
                    methodParams: [args.address]
                });
                if(res[0]) res = fromBigNumber(res[0]);
                else return 0;
            break;
        }
        return res || 0; 
    } catch (error) {
        debugError(error);
        return 0;
    }
};

export const approve = async (args: {
    spenderAddress: string,
    amount: string,
    tokenAddress: string,
    ownerAddress: string,
}) => {
    try {
        await interactWithContract({
            abi: ERC20_ABI,
            address: args.tokenAddress,
            methodName: 'approve',
            methodParams: [
                args.spenderAddress, // spender
                args.amount, // amount
            ]
        });
    } catch (error) {
        debugError(error);
    }
}

export const totalSupply = async (args: {
    tokenAddress: string,
}) => {
    try {
        const tokenAddress = args.tokenAddress;
        if(!tokenAddress) return 0;
        const res: number = await readSmartContract({
            abi: ERC20_ABI,
            address: tokenAddress,
            methodName: 'totalSupply',
            methodParams: []
        });
        return res; 
    } catch (error) {
        debugError(error);
        return 0;
    }
}

export const symbol = async (args: {
    tokenAddress: string,
}) => {
    try {
        const tokenAddress = args.tokenAddress;
        if(!tokenAddress) return '';
        const res: string = await readSmartContract({
            abi: ERC20_ABI,
            address: tokenAddress,
            methodName: 'symbol',
            methodParams: []
        });
        return res; 
    } catch (error) {
        debugError(error);
        return '';
    }
}

export const name = async (args: {
    tokenAddress: string,
}) => {
    try {
        const tokenAddress = args.tokenAddress;
        if(!tokenAddress) return '';
        const res: string = await readSmartContract({
            abi: ERC20_ABI,
            address: tokenAddress,
            methodName: 'name',
            methodParams: []
        });
        return res; 
    } catch (error) {
        debugError(error);
        return '';
    }
}

export const transferTokens = async (args: {
    to: string,
    amount: string,
    tokenAddress: string,
    from: string,
}) => {
    return await interactWithContract({
        address: args.tokenAddress,
        abi: ERC20_ABI,
        methodName: 'transfer',
        methodParams: [
            args.to,
            args.amount
        ]
    });
}

    