
import { accounts, latestBlock } from "$lib/stores/application";
import { get } from "svelte/store";
import { getTransactionObject, readSmartContract } from "./web3";
import abi from "./abis/router.json" assert {type: 'json'};


export const ROUTER_ADDRESS: Readonly<string> = '0xAcfA21F4f4148A0EAf0420D972E1a75c17ef9B4b';
export const ROUTER_ABI: Array<any> = abi;

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
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'swapExactTokensForTokens', //0x05a1450d
            methodParams: [
                args.amount.toString(), // amountIn
                0, // amountOutMin
                [args.addressA,args.addressB], // path
                args.to || get(accounts)[0],// to
                (args.deadline || get(latestBlock) + 10).toString(), // deadline
                _contracts.address0 // affiliateAddress
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
    address: any,
    callBack: Function
}) => {
    try{
        readSmartContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'WETH',
            methodParams: [],
        })
        .then(async (wethAddress)=>{
            console.log([wethAddress,args.address]);
            
            await getTransactionObject({
                abi: ROUTER_ABI,
                address: ROUTER_ADDRESS,
                methodName: 'swapExactETHForTokens', //0x344933be
                methodParams: [
                    0, // amountOutMin
                    [wethAddress,args.address], // path
                    args.to || get(accounts)[0], // to
                    (args.deadline || get(latestBlock) + 10).toString(), // deadline
                    _contracts.address0 // affiliateAddress
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