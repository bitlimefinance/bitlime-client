<script lang="ts">
	import Input from "$lib/components/general/input.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { allowance, approve, balanceOf, decimals } from "$lib/core/sdk/erc20";
	import { accounts } from "$lib/stores/application";
	import Button from "$lib/components/general/button.svelte";
	import SwapInput from "$lib/components/swap/swapInput.svelte";
	import { onMount } from "svelte";
	import Select from "../general/select.svelte";
	import type { PoolType } from "$lib/core/descriptors/types";
	import Toggle from "../general/toggle.svelte";
	import { FACTORY_ADDRESS, getPair } from "$lib/core/sdk/factory";
	import { LMC_ADDRESS } from "$lib/core/sdk/lime";
	import { noOfDecimalsToUnits } from "$lib/core/sdk/web3";
	import { debugWarn } from "$lib/core/utils/debug";
	import { formatNumber } from "$lib/core/utils/utilities";

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
        if(tokenA?.address) needsApprovalA = await allowance({ address: $accounts[0] as string, spender: FACTORY_ADDRESS, tokenAddress: tokenA.address }) <= (inputAValue || 0);
        needsApprovalB = await allowance({ address: $accounts[0] as string, spender: FACTORY_ADDRESS, tokenAddress: LMC_ADDRESS }) <= (inputBValue || 0);
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
                        spenderAddress: FACTORY_ADDRESS,
                        amount: await window.web3.utils.toWei(await balanceA.toString(), noOfDecimalsToUnits(decimalsA))+'000000000',
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
                        spenderAddress: FACTORY_ADDRESS,
                        amount: await window.web3.utils.toWei(await balanceB.toString(), noOfDecimalsToUnits(18))+'000000000',
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

<div class="rounded-xl p-4 max-w-lg">
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
        <div id="token-b-container" class='bg-zinc-50 border dark:border-transparent dark:bg-zinc-800 rounded-xl p-3 space-y-3'>
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
        <div id="token-a-container" class='bg-zinc-50 border dark:border-transparent dark:bg-zinc-800 rounded-xl'>
            <SwapInput
                bind:input={inputA}
                bind:selectedToken={tokenA}
                bind:balance={balanceA}
                bind:decimals={decimalsA}
                selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                id="token-input-a"
                bind:value={inputAValue}
                />
            {#if needsApprovalA}
            <div class="px-3 -mt-5 mb-2">
                <Button
                    label={"APPROVE " + tokenA?.symbol || 'TOKEN'}
                    additionalClassList="min-w-full mt-2 pt-3"
                    theme="secondary"
                    on:click={getApprovalA}
                    />
            </div>
            {/if}
            <div class="p-3">
                <div class="flex gap-2 font-medium items-center bg-zinc-400 border border-zinc-200 dark:border-transparent bg-opacity-10 w-fit rounded-lg p-2">
			        <img src={"/assets/bl-logos/logo-bold.png"} alt="" class="h-5 w-5 rounded-md"/>
                    Lime
                </div>
                <Input
                    placeholder={poolExists?"":"0.00"}
                    type="number"
                    additionalClasses="text-4xl w-full bg-transparent border-0 px-0 py-3{poolExists?" placeholder-white":""}"
                    bind:value={inputBValue}
                    disabled={poolExists}
                    />
                <div class="dark:opacity-50 text-sm font-light mb-3">
                    Balance: {formatNumber((balanceB/(Math.pow(10, decimalsB)))||'0', 'number',0,decimalsB)}
                </div>
                {#if needsApprovalB}
                <div class="-mt-3">
                    <Button
                        label={"APPROVE " + tokenB?.symbol || 'TOKEN'}
                        additionalClassList="min-w-full mt-2 pt-3"
                        theme="secondary"
                        on:click={getApprovalB}
                        />
                </div>
                {/if}
            </div>
        </div>
        <Button
            label={addLiquidityButtonLabel}
            additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-2"
            disabled={addLiquidityButtonDisabled}
            theme={addLiquidityButtonDisabled?"secondary":"primary"}
            />
    </div> 
</div>

