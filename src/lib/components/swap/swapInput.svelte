<script lang="ts">
	import { _WALLETS } from "$lib/globals";
	import { accounts, connected } from "$lib/stores/application";
	import Input from "../general/input.svelte";
	import TokenSelector from "./tokenSelector.svelte";
	import { SyncLoader } from 'svelte-loading-spinners';
	import { createEventDispatcher } from "svelte";

    export let id: string = 'swap-input';
    export let value: number;
    export let disabled: boolean = false;
    export let defaultToken: string = '';
    export let selectedToken: any = {};
    export let balance: any = 0;
    export let decimals: any = 18;
    export let selectedTokens: Array<any> = [];
    export let loading: boolean = false;

    export let input: HTMLInputElement;
    let inputIsFocused:boolean = false;

    const dispatch = createEventDispatcher();

</script>


<div id="{id}-container" class='bg-zinc-50/[0.3] border border-transparent dark:bg-zinc-800 dark:border-0 rounded-xl p-3'>
    <div class="flex justify-between">
        <TokenSelector bind:value={selectedToken} selectedTokens={selectedTokens} defaultToken={defaultToken} on:switch={()=>{dispatch('switch')}}/>
    </div>
    <div  class="{selectedToken?.address && $accounts[0]?'input-area-lg':'input-area-sm'}">
        <div class={loading?'hidden':'block'}>
            <Input
                bind:isFocused={inputIsFocused}
                bind:value
                bind:input={input}
                placeholder="0.00"
                disabled={disabled}
                id={id}
                type="number"
                additionalClasses="text-4xl w-full bg-transparent border-0 px-0 py-3"
                />
            {#if $connected&&$connected!=_WALLETS.DISCONNECTED&&selectedToken?.address}
                <div class="dark:opacity-50 text-sm font-light mb-3">
                    Balance: {(balance/(Math.pow(10, decimals)))||'0'}
                </div>
            {/if}
        </div>
        {#if loading && selectedToken.address}
            <div class="flex items-center">
                <SyncLoader size="40" color="#94949450" unit="px" duration="1s"/>
                <span class="text-4xl opacity-0 py-3">0</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .input-area-lg {
        min-height: 94px;
    }
    .input-area-sm {
        min-height: 64px;
    }
</style>