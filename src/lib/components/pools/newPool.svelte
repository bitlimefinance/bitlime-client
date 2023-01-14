<script lang="ts">
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { allowance, approve, balanceOf, decimals } from "$lib/core/sdk/erc20";
	import { accounts } from "$lib/stores/application";
	import Button from "$lib/components/general/button.svelte";
	import SwapInput from "$lib/components/swap/swapInput.svelte";
	import { onMount } from "svelte";
	import Select from "../general/select.svelte";
	import type { PoolType } from "$lib/core/descriptors/types";
	import Toggle from "../general/toggle.svelte";
	import { getPair } from "$lib/core/sdk/factory";
	import { LMC_ADDRESS } from "$lib/core/sdk/lime";
	import { debugWarn } from "$lib/core/utils/debug";
	import { addLiquidityETH, addLiquidty, ROUTER_ADDRESS } from "$lib/core/sdk/router";
	import Icon from "../general/icon.svelte";
	import { web3Provider, noOfDecimalsToUnits } from "$lib/core/sdk/web3";

    let advanced: boolean = false;
    let mounted: boolean = false;
    let gettingData: boolean = false;

    let poolType: PoolType;

    let tokenA: any = {};
    let tokenB: any = {
        "address": "0xBbD41C7668e08d39F0D2360D7756CaacCC7008B0",
        "image": "https://s3.amazonaws.com/appforest_uf/f1670644353042x979300179939404800/logo.png",
        "name": "Lime Coin",
        "symbol": "LMC",
        "chain_id": "5",
        "_id": "0"
    };

    let inputAValue: any;
    let inputBValue: any;

    let needsApprovalA: boolean = false;
    let needsApprovalB: boolean = false;

    let notEnoughBalanceA: boolean = false;
    let notEnoughBalanceB: boolean = false;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

    let balanceA: number, balanceB: number;
    let decimalsA: any;
    let decimalsB: number = 18;

    let poolExists: boolean = false;

    $: addLiquidityButtonLabel = notEnoughBalanceA || notEnoughBalanceB ? 'Insufficient funds' : needsApprovalA || needsApprovalB ? 'Needs approval' : 'Add liquidity';
    $: addLiquidityButtonDisabled = gettingData || notEnoughBalanceA || notEnoughBalanceB || !inputAValue || !inputBValue || needsApprovalA || needsApprovalB;

    const validateTokens = async () => {
        if(tokenA?.address) needsApprovalA = await allowance({ address: $accounts[0] as string, spender: ROUTER_ADDRESS, tokenAddress: tokenA.address }) <= (inputAValue || 0);
        needsApprovalB = await allowance({ address: $accounts[0] as string, spender: ROUTER_ADDRESS, tokenAddress: LMC_ADDRESS }) <= (inputBValue || 0);
        if(tokenA?.address) notEnoughBalanceA = balanceA < (inputAValue || 0);
        notEnoughBalanceB = balanceB < (inputBValue || 0);
    }

    const getTokensData = async () => {
        gettingData = true;
        balanceB = await balanceOf({ address: $accounts[0], tokenAddress: LMC_ADDRESS });
        if(tokenA?.address){
            decimalsA = await decimals({ tokenAddress: tokenA.address });
            balanceA = await balanceOf({ address: $accounts[0], tokenAddress: tokenA.address });
            poolExists = await getPair({tokenAddressA: tokenA?.address, tokenAddressB: tokenB?.address});
        }
        await validateTokens();
        gettingData = false;
    }

    const getApprovalA = async () => {
        if(needsApprovalA && tokenA?.address){
            await approve({
                        tokenAddress: tokenA.address,
                        spenderAddress: ROUTER_ADDRESS,
                        amount: await web3Provider.utils.toWei(await balanceA.toString(), noOfDecimalsToUnits(decimalsA))+'000000000',
                        ownerAddress: $accounts[0]
                    });
        } else {
            debugWarn('No approval needed');
            updateData();
        }
    }

    const getApprovalB = async () => {
        if(needsApprovalB){
            await approve({
                        tokenAddress: LMC_ADDRESS,
                        spenderAddress: ROUTER_ADDRESS,
                        amount: await web3Provider.utils.toWei(await balanceB.toString(), noOfDecimalsToUnits(18))+'000000000',
                        ownerAddress: $accounts[0]
                    });
        } else {
            debugWarn('No approval needed');
            updateData();
        }
    }

    
    const refreshTimer: Readonly<number> = 30;
    export let refreshCounter: number = refreshTimer;
    
    const updateData = () => {
        getTokensData();
        refreshCounter = refreshTimer;
    }

    $: tokenA, updateData();

    accounts.subscribe(() => {
        updateData();
    })

    const provideLiquidity = async () => {
        if(!tokenA?.address || !tokenB?.address) return;
        if(tokenA.address == tokenB.address) return;
        if(needsApprovalA) return getApprovalA();
        if(needsApprovalB) return getApprovalB();
        if(notEnoughBalanceA || notEnoughBalanceB) return;
        if(!inputAValue || !inputBValue) return;
        let inputAToWei = await web3Provider.utils.toWei(inputAValue.toString(), noOfDecimalsToUnits(decimalsA));
        let inputBToWei = await web3Provider.utils.toWei(inputBValue.toString(), noOfDecimalsToUnits(decimalsB));
        if(tokenA.address == "native") addLiquidityETH({
            tokenAddress: LMC_ADDRESS,
            amountTokenDesired: inputBToWei,
            amountETHDesired: inputAToWei,
            amountTokenMin: inputBToWei,
            amountETHMin: inputAToWei,
            to: $accounts[0],
        });
        else addLiquidty({
            tokenAddressA: tokenA.address,
            tokenAddressB: LMC_ADDRESS,
            amountADesired: inputAToWei,
            amountBDesired: inputBToWei,
            amountAMin: '0',
            amountBMin: '0',
            to: $accounts[0],
        });
    }

    onMount(async () => {
        mounted = true;
        setInterval(() => {
            if(tokenA?.address || tokenB?.address){
                if(refreshCounter>-1) refreshCounter--;
                if(refreshCounter<=1){
                    if(gettingData) return;
                    if(!tokenA?.address && !tokenB?.address) return;
                    updateData();
                }
            }else{
                refreshCounter = refreshTimer;
            }
        }, 1000);
    });
</script>

<div class="rounded-xl p-4 max-w-2xl">
    <div class="flex justify-between items-end mb-3">
        <div>
            <h1
                class="text-zinc-900 dark:text-white font-medium text-2xl"
                >
                Provide liquidity
            </h1>
            <p
                class="text-zinc-700 dark:text-zinc-400 text-sm"
                >
                If the pool doesn't exist, it will be created.
            </p>
        </div>
        <div class="flex justify-end gap-3 items-center w-fit">
            <Tooltip content="Advanced mode">
                <Toggle showIcon bind:value={advanced}/>
            </Tooltip>
            <div class="flex justify-end items-center gap-3 h-fit w-fit">   
                {#if tokenA?.address || tokenB?.address || tokenA?.is_native || tokenB?.is_native}
                    <Tooltip content={`
                        Click to update data<br>
                        <div class="text-xs opacity-60">Auto update in ${refreshCounter}</div>
                    `}>
                        <svg on:click={()=>{updateData()}} on:keyup xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300 {gettingData?'animate-spin':''}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </Tooltip>
                {/if}
            </div>
        </div>
    </div>
    
    <div class="flex flex-col space-y-2">
        {#if advanced}
        <div class='bg-zinc-50 border dark:border-transparent dark:bg-zinc-800 rounded-xl p-3 space-y-3'>
            <div class="flex justify-center items-center gap-4">
                <Select
                    value={poolType}
                    id="pool-type"
                    options={[
                        ['Standard', 'weighted'],
                        ['Stable', 'stable'],
                        ['Pegged', 'pegged'],
                    ]}
                    label="Pool type"
                    />
                <Toggle showIcon label={'Meta assets?'} inline={false} fullWidth/>
            </div>
        </div>
        {/if}
        <div class='flex items-stretch justify-center'>
            <div class="w-full bg-zinc-50/[0.3] border border-transparent dark:bg-zinc-800/[0.7] dark:border-0 rounded-xl p-3">
                <SwapInput
                    bind:input={inputA}
                    bind:selectedToken={tokenA}
                    bind:balance={balanceA}
                    bind:decimals={decimalsA}
                    selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                    id="token-input-a"
                    customClassList="bg-transparent"
                    bind:value={inputAValue}
                    />
                {#if needsApprovalA || needsApprovalB}
                <div>
                    {#if needsApprovalA}
                        <Button
                            label={"APPROVE " + tokenA?.symbol || 'TOKEN'}
                            additionalClassList="min-w-full pt-3"
                            theme="secondary"
                            on:click={getApprovalA}
                            />
                    {:else} 
                        <div class="flex justify-center gap-2 items-center w-full bg-transparent text-green-400 dark:text-green-400 hover:shadow-md font-medium rounded-lg text-sm px-3 py-2 text-center disabled:opacity-80 disabled:btn-ghost disabled:cursor-default">
                            <div class="dark:text-green-400 text-green-400">
                                <Icon icon="check-circle"/>
                            </div>
                            ALREADY APPROVED
                        </div>
                    {/if}
                </div>
                {/if}
            </div>
            <div class="my-auto mx-2 w-fit h-fit text-2xl text-center">
                +
            </div>
            <div class="w-full bg-zinc-50/[0.3] border border-transparent dark:bg-zinc-800/[0.7] dark:border-0 rounded-xl">
                <div class="w-full bg-zinc-50/[0.3] border border-transparent dark:bg-zinc-800/[0.7] dark:border-0 rounded-xl p-3">
                    <SwapInput
                        bind:input={inputB}
                        bind:selectedToken={tokenB}
                        bind:balance={balanceB}
                        bind:decimals={decimalsB}
                        selectedTokenDisabled
                        selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                        id="token-input-b"
                        customClassList="bg-transparent"
                        bind:value={inputBValue}
                    />
                    {#if needsApprovalB || needsApprovalA}
                    <div>
                        {#if needsApprovalB}
                        <Button
                            label={"APPROVE " + tokenB?.symbol || 'TOKEN'}
                            additionalClassList="min-w-full mt-2 pt-3"
                            theme="secondary"
                            on:click={getApprovalB}
                            />
                        {:else}
                        <div class="flex justify-center gap-2 items-center w-full bg-transparent text-green-400 dark:text-green-400 hover:shadow-md font-medium rounded-lg text-sm px-3 py-2 text-center disabled:opacity-80 disabled:btn-ghost disabled:cursor-default">
                            <div class="dark:text-green-400 text-green-400">
                                <Icon icon="check-circle"/>
                            </div>
                            ALREADY APPROVED
                        </div>
                        {/if}
                    </div>
                    {/if}
                </div>
            </div>
        </div>
        <Button
            label={addLiquidityButtonLabel}
            additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-2"
            disabled={addLiquidityButtonDisabled}
            theme={addLiquidityButtonDisabled?"secondary":"primary"}
            on:click={provideLiquidity}
            />
    </div> 
</div>

