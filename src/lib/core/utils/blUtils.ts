import { _contracts } from "$lib/contractsReference";
import { accounts, latestBlock } from "$lib/stores/application";
import { get } from "svelte/store";
import { getTransactionObject, readSmartContract } from "../web3Manager";


export const swapExactTokensForTokens = async (args: {
    to: any,
    deadline: any,
    amount: any,
    addressA: any,
    addressB: any,
    slippage: any,
    callBack: Function
}) => {
    try{
        await getTransactionObject({
            abi: _contracts.router.abi,
            address: _contracts.router.address,
            methodName: 'swapExactTokensForTokens', //0x05a1450d
            methodParams: [
                args.amount.toString(), // amountIn
                0, // amountOutMin
                [args.addressA,args.addressB], // path
                args.to || get(accounts)[0],// to
                args.deadline || get(latestBlock) + 10, // deadline
                _contracts.address0 // feeTo
            ],
        })
        .then(async (data)=>{
            args.callBack(data);
        })
        .catch((err)=>{
            console.log(err);
        });
    }catch(err){
        console.error(err);
    }
};

export const swapExactETHForTokens = async (args: {
    to: any,
    deadline: any,
    amount: any,
    address: any,
    slippage: any,
    callBack: Function
}) => {
    try{
        readSmartContract({
            abi: _contracts.router.abi,
            address: _contracts.router.address,
            methodName: 'WETH',
            methodParams: [],
        })
        .then(async (wethAddress)=>{
            console.log(wethAddress);
            console.log(args.address);
            console.log(args.amount);
            
            await getTransactionObject({
                abi: _contracts.router.abi,
                address: _contracts.router.address,
                methodName: 'swapExactETHForTokens', //0x344933be
                methodParams: [
                    args.amount.toString(), // amountIn
                    0, // amountOutMin
                    [wethAddress,args.address], // path
                    args.to || get(accounts)[0],// to
                    args.deadline || get(latestBlock) + 10, // deadline
                    _contracts.address0 // feeTo
                ],
            })
            .then(async (data)=>{
                args.callBack(data);
            })
            .catch((err)=>{
                console.error(err);
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    }catch(err){
        console.error(err);
    }
};