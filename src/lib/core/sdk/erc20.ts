
import { getBalance, getTransactionObject, noOfDecimalsToUnits, readSmartContract } from "./web3";
import abi from "./abis/erc20.json" assert {type: 'json'};
import { sendTransaction } from "./eip-1193";
import { getNativeToken } from "./router";

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
    try {
        if(!args.address || !args.tokenAddress) return 0;
        let res: number = 0;
        switch(args.tokenAddress){
            case 'native' || '':
                res = await getBalance(args.address);
                break;
            default:
                res = await readSmartContract({
                    abi: abi,
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