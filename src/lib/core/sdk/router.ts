
import { accounts, latestBlock } from "$lib/stores/application";
import { get } from "svelte/store";
import abi from "./abis/router.json" assert {type: 'json'};
import { debug, debugError } from "../utils/debug";
import { constants, ethers } from "ethers";
import { interactWithContract, readSmartContract } from "./web3/contracts/lib";
import { web3Provider } from "./web3/provider/lib";
import { FACTORY_ADDRESS } from "./factory";

export const ROUTER_ADDRESS: Readonly<string> = '0xAcfA21F4f4148A0EAf0420D972E1a75c17ef9B4b';
export const ROUTER_ABI: any[] = abi;


export const getNativeToken = async () => {
    const address =  await readSmartContract({
        abi: ROUTER_ABI,
        address: ROUTER_ADDRESS,
        methodName: 'WETH',
        methodParams: [],
    });
    
    if(!address || address===constants.AddressZero) throw new Error('No token found');
    if(address.length) return address[0];    
    return address;
}

export const getAmountsOut = async (args: {
    amountIn: string,
    tokenAddressA: string,
    tokenAddressB: string,
    affiliateAddress?: string,
}) => {
    const { amountIn, tokenAddressA, tokenAddressB, affiliateAddress } = args;
    return await readSmartContract({
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        methodName: 'getAmountsOut',
        methodParams: [amountIn, [tokenAddressA,tokenAddressB], affiliateAddress || constants.AddressZero]
    })
}

export const getAmountsIn = async (args: {
    amountOut: string,
    tokenAddressA: string,
    tokenAddressB: string,
    affiliateAddress?: string,
}) => {
    const { amountOut, tokenAddressA, tokenAddressB, affiliateAddress } = args;
    return await readSmartContract({
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        methodName: 'getAmountsIn',
        methodParams: [amountOut, [tokenAddressA,tokenAddressB], affiliateAddress || constants.AddressZero]
    })
}


export const swapExactTokensForTokens = async (args: {
    to: any,
    deadline?: any,
    amountIn: any,
    tokenAddressA: any,
    tokenAddressB: any,
    slippage?: any,
    affiliateAddress?: string,
    callBack?: any
}) => {
    try{
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'swapExactTokensForTokens',
            methodParams: [
                args.amountIn.toString(), // amountIn
                0, // amountOutMin
                [args.tokenAddressA,args.tokenAddressB], // path
                args.to || get(accounts)[0],// to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
                args.affiliateAddress || constants.AddressZero // affiliateAddress
            ],
        });


        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
    }
};

export const swapExactETHForTokens = async (args: {
    to: any,
    tokenAddressB: any,
    amountIn: any,
    deadline?: number,
    affiliateAddress?: string,
    slippage?: any,
    callBack?: any
}) => {
    try{
        const nativeToken =  await getNativeToken();
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'swapExactETHForTokens',
            methodParams: [
                0, // amountOutMin
                [nativeToken,args.tokenAddressB], // path
                args.to || get(accounts)[0], // to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
                args.affiliateAddress || constants.AddressZero // affiliateAddress
            ],
        });
        if (args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
        return null;
    }
};


export const swapExactTokensForETH = async (args: {
    to: any,
    tokenAddressA: any,
    amountIn: any,
    deadline?: any,
    affiliateAddress?: string,
    slippage?: any,
    callBack?: any
}) => {
    try{
        const nativeToken =  await getNativeToken();
            
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'swapExactTokensForETH',
            methodParams: [
                args.amountIn.toString(), // amountIn
                0, // amountOutMin
                [args.tokenAddressA,nativeToken], // path
                args.to || get(accounts)[0],// to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
                args.affiliateAddress || constants.AddressZero // affiliateAddress
            ],
        });

        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
        return null;
    }
};


export const methodsSwitcher = async (args: {
    to: any,
    tokenAddressA: any,
    tokenAddressB: any,
    amountIn: any,
    expressedMethod?: Function,
    amountOutMin?: any,
    deadline?: any,
    affiliateAddress?: string,
    slippage?: any,
    callBack?: any
}) => {
    const { to, tokenAddressA, tokenAddressB, amountIn, expressedMethod, amountOutMin, deadline, affiliateAddress, slippage, callBack } = args;
    if (expressedMethod) {
        expressedMethod();
    } else if (tokenAddressA == 'native'){
        
        await swapExactETHForTokens({
            to,
            tokenAddressB,
            amountIn,
            deadline,
            affiliateAddress,
            slippage,
            callBack
        });
    } else if (tokenAddressB == 'native'){
        await swapExactTokensForETH({
            to,
            tokenAddressA,
            amountIn,
            deadline,
            affiliateAddress,
            slippage,
            callBack
        });
    } else {
        await swapExactTokensForTokens({
            to,
            tokenAddressA,
            tokenAddressB,
            amountIn,
            deadline,
            affiliateAddress,
            slippage,
            callBack
        });
    }
}

export const addLiquidty = async (args: {
    tokenAddressA: string,
    tokenAddressB: string,
    amountADesired: string,
    amountBDesired: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline?: string,
    callBack?: any
}) => {
    try{
        debug('addLiquidty', args);

        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'addLiquidity',
            methodParams: [
                args.tokenAddressA, // tokenA
                args.tokenAddressB, // tokenB
                args.amountADesired, // amountADesired
                args.amountBDesired, // amountBDesired
                args.amountAMin, // amountAMin
                args.amountBMin, // amountBMin
                args.to, // to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
            ],
        });

        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
    }
}

export const addLiquidityETH = async (args: {
    tokenAddress: string,
    amountTokenDesired: string,
    amountETHDesired: string,
    amountTokenMin: string,
    amountETHMin: string,
    to: string,
    deadline?: string,
    callBack?: any
}) => {
    try{
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'addLiquidityETH',
            methodParams: [
                args.tokenAddress, // token
                args.amountTokenDesired, // amountTokenDesired
                args.amountTokenMin, // amountTokenMin
                args.amountETHMin, // amountETHMin
                args.to, // to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
            ],
        });

        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
    }
}

export const removeLiquidity = async (args: {
    tokenAddressA: string,
    tokenAddressB: string,
    liquidity: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline?: string,
    callBack?: any
}) => {
    try{
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'removeLiquidity', //0x2f9e608e
            methodParams: [
                args.tokenAddressA, // tokenA
                args.tokenAddressB, // tokenB
                args.liquidity, // liquidity
                args.amountAMin, // amountAMin
                args.amountBMin, // amountBMin
                args.to, // to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
            ],
        });

        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
    }
}

export const removeLiquidityETH = async (args: {
    tokenAddress: string,
    liquidity: string,
    amountTokenMin: string,
    amountETHMin: string,
    to: string,
    deadline?: string,
    callBack?: any
}) => {
    try{
        const tx = await interactWithContract({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            methodName: 'removeLiquidityETH', //0x9e67ed8e
            methodParams: [
                args.tokenAddress, // token
                args.liquidity, // liquidity
                args.amountTokenMin, // amountTokenMin
                args.amountETHMin, // amountETHMin
                args.to, // to
                (Date.now() + (args.deadline || 1200)).toString(), // deadline
            ],
        });

        if(args.callBack) await args.callBack(tx);

        return tx;
    }catch(err){
        debugError(err);
    }
}