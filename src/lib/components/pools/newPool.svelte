<script lang="ts">
	import Input from "$lib/components/general/input.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import TokenSelector from "$lib/components/swap/tokenSelector.svelte";
	import SwapInput from "../swap/swapInput.svelte";

    let gettingData: boolean = false;

    let tokenA: any = {};
    let tokenB: any = {};

    let inputAValue: number;
    let inputBValue: number;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

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
                selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                id="token-input-a"
                bind:value={inputAValue}
                />
            
            <SwapInput
                bind:input={inputB}
                bind:selectedToken={tokenB}
                selectedTokens={[tokenA?.is_native?'native':tokenA?.address || '', tokenB?.is_native?'native':tokenB?.address || '']}
                id="token-input-b"
                disabled
                bind:value={inputBValue}
                />
        </div>
    </div> 
</div>

