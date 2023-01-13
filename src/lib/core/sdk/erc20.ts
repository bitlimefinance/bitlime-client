
import { getBalance, getTransactionObject, interactWithContract, noOfDecimalsToUnits, readSmartContract} from "./web3";
import abi from "./abis/erc20.json" assert {type: 'json'};
import { sendTransaction } from "./eip-1193";
import { debugError } from "../utils/debug";
import { get } from "svelte/store";
import { selectNetwork } from "$lib/stores/application";

export const ERC20_ABI: any[] = abi;

export const decimals = async (args: {
    tokenAddress: string,
}) => {
    try{
        if(args.tokenAddress === 'native') return get(selectNetwork)?.decimals || 18;
        else {
            let res = await readSmartContract({
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
        // console.error(err);
    });
};

export const balanceOf = async (args: {
    address: string,
    tokenAddress: string,
}) => {
    try {
        if(!args.address || !args.tokenAddress) return 0;
        let res: number = 0;
        switch(args.tokenAddress){
            case 'native' || '':
                res = await getBalance(args.address);
                break;
            default:
                res = await readSmartContract({
                    abi: ERC20_ABI,
                    address: args.tokenAddress,
                    methodName: 'balanceOf',
                    methodParams: [args.address]
                });
            break;
        }
        return res; 
    } catch (error) {
        console.error(error);
        return 0;
    }
};

export const approve = async (args: {
    spenderAddress: string,
    amount: string,
    tokenAddress: string,
    ownerAddress: string,
}) => {
    getTransactionObject({
        abi: ERC20_ABI,
        address: args.tokenAddress,
        methodName: 'approve',
        methodParams: [
            args.spenderAddress, // spender
            args.amount, // amount
        ],
    })
    .then(async (data)=>{
        await sendTransaction({
            to: args.tokenAddress,
            from: args.ownerAddress,
            value: null,
            data: data?.encodeABI(),
            chainId: null,
            gasPrice: null,
            gas: null,
            nonce: null
        });
    })
    .catch((err)=>{
        console.log(err);
    });
}

export const totalSupply = async (args: {
    tokenAddress: string,
}) => {
    try {
        let tokenAddress = args.tokenAddress;
        if(!tokenAddress) return 0;
        let res: number = await readSmartContract({
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
        let tokenAddress = args.tokenAddress;
        if(!tokenAddress) return '';
        let res: string = await readSmartContract({
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
        let tokenAddress = args.tokenAddress;
        if(!tokenAddress) return '';
        let res: string = await readSmartContract({
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
        contractAddress: args.tokenAddress,
        contractABI: ERC20_ABI,
        methodName: 'transfer',
        methodParams: [
            args.to,
            args.amount
        ]
    });
}

    