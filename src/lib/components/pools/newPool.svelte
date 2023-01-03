<script lang="ts">
	import Input from "$lib/components/general/input.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import TokenSelector from "$lib/components/swap/tokenSelector.svelte";
	import { allowance, balanceOf, decimals } from "$lib/core/sdk/erc20";
	import { accounts } from "$lib/stores/application";
	import Button from "$lib/components/general/button.svelte";
	import SwapInput from "$lib/components/swap/swapInput.svelte";
	import { onMount } from "svelte";
	import { ROUTER_ADDRESS } from "$lib/core/sdk/router";
	import Select from "../general/select.svelte";
	import type { PoolType } from "$lib/core/descriptors/types";
	import Toggle from "../general/toggle.svelte";
	import { getPair } from "$lib/core/sdk/factory";
	import { LIME_ADDRESS } from "$lib/core/sdk/lime";

    let advanced: boolean = false;

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
    let decimalsA: number | undefined | null;
    let decimalsB: number = 18;

    let poolExists: boolean = false;

    const getTokensData = async () => {
        gettingData = true;
        balanceB = await balanceOf({ address: $accounts[0], tokenAddress: LIME_ADDRESS });
        if(tokenA?.address){
            decimalsA = await decimals({ tokenAddress: tokenA.address });
            balanceA = await balanceOf({ address: $accounts[0], tokenAddress: tokenA.address });
            poolExists = await getPair({tokenAddressA: tokenA?.address, tokenAddressB: tokenB?.address});
        }
        gettingData = false;
    }

    const validateToken = async () => {
        gettingData = true;
        needsApprovalA = await allowance({ address: $accounts[0] as string, spender: ROUTER_ADDRESS, tokenAddress: tokenA.address }) < inputAValue;
        gettingData = false;
    }

    const tokenChanged = () => {
        inputAValue = null;
        inputBValue = null;
        balanceA = 0;
        decimalsA = null;
        getTokensData();
    }

    $: tokenA, tokenChanged();

    accounts.subscribe(() => {
        tokenChanged();
    })

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
            <div class="p-3">
                <div class="flex gap-2 font-medium items-center bg-zinc-400 border border-zinc-200 dark:border-transparent bg-opacity-10 w-fit rounded-lg p-2">
			        <img src={"/assets/bl-logos/logo-bold.png"} alt="" class="h-5 w-5 rounded-md"/>
                    Lime
                </div>
                <Input
                    placeholder="0.00"
                    type="number"
                    additionalClasses="text-4xl w-full bg-transparent border-0 px-0 py-3"
                    />
                <div class="dark:opacity-50 text-sm font-light mb-3">
                    Balance: {(balanceB/(Math.pow(10, decimalsB)))||'0'}
                </div>
            </div>
        </div>
        <Button
            label="Add Liquidity"
            additionalClassList="min-w-full mt-2 pt-3"
            />
    </div> 
</div>

