<script lang="ts">
	import Input from "$lib/components/general/input.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import TokenSelector from "$lib/components/swap/tokenSelector.svelte";
	import { balanceOf, decimals } from "$lib/core/sdk/erc20";
	import { accounts } from "$lib/stores/application";
	import Button from "$lib/components/general/button.svelte";
	import SwapInput from "$lib/components/swap/swapInput.svelte";
	import { onMount } from "svelte";

    let gettingData: boolean = false;

    let tokenA: any = {};
    let tokenB: any = {};

    let inputAValue: number | undefined | null;
    let inputBValue: number | undefined | null;

    let needsApprovalA: boolean = false;
    let needsApprovalB: boolean = false;

    let notEnoughBalanceA: boolean = false;
    let notEnoughBalanceB: boolean = false;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

    let balanceA: number, balanceB = 0;
    let decimalsA: number | undefined | null, decimalsB: number | undefined | null;

    const getTokensData = async () => {
        gettingData = true;
        if(tokenA.address){
            decimalsA = await decimals({ tokenAddress: tokenA.address });
            balanceA = await balanceOf({ address: $accounts[0], tokenAddress: tokenA.address });
        }
        if(tokenB.address){
            decimalsB = await decimals({ tokenAddress: tokenB.address });
            balanceB = await balanceOf({ address: $accounts[0], tokenAddress: tokenB.address });
        }
        gettingData = false;
    }

    const validateToken = async () => {
        gettingData = true;
        needsApprovalA = 
        gettingData = false;
    }

    const tokenChanged = () => {
        inputAValue = null;
        inputBValue = null;
        balanceA = 0;
        balanceB = 0;
        decimalsA = null;
        decimalsB = null;
        getTokensData();
    }

    $: tokenA, tokenChanged();
    $: tokenB, tokenChanged();

</script>

<div class="rounded-xl p-4 max-w-lg">
    <div class="flex justify-between items-center mb-3">
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
        <div class="flex justify-end items-center gap-3 h-fit w-fit">   
                <Tooltip content={`
                    Click to update data
                `}>
                    <svg on:click={()=>{}} on:keyup xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300 {gettingData?'animate-spin':''}">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </Tooltip>
        </div>
    </div>
    
    <div class="flex flex-col bg-zinc-50 border dark:border-transparent dark:bg-zinc-800 rounded-lg">
        <div id="token-a-container" class='rounded-xl'>
            <SwapInput
                bind:input={inputA}
                bind:selectedToken={tokenA}
                bind:balance={balanceA}
                bind:decimals={decimalsA}
                selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                id="token-input-a"
                bind:value={inputAValue}
                />
            <div class="flex justify-center items-center">
                <div class="border-b-4 border-b-zinc-900 h-1 w-full mx-0"/>
                <div class="min-w-fit border-4 border-zinc-900 rounded-full">
                    <svg class="w-8 h-8 text-zinc-800 dark:text-zinc-500 dark:hover:text-white bg-zinc-800 p-1.5 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.4" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                    </svg>
                </div>
                <div class="border-b-4 border-b-zinc-900 h-1 w-full mx-0"/>
            </div>
            <SwapInput
                bind:input={inputB}
                bind:selectedToken={tokenB}
                bind:balance={balanceB}
                bind:decimals={decimalsB}
                selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                id="token-input-b"
                disabled
                bind:value={inputBValue}
                />
        </div>
        <div class="w-full p-3">
            <Button
                label="Add Liquidity"
                additionalClassList="min-w-full"
                />
        </div>
    </div> 
</div>

