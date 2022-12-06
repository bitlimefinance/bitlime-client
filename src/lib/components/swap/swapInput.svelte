<script lang="ts">
	import { _WALLETS } from "$lib/globals";
	import { connected } from "$lib/stores/application";
	import Input from "../general/input.svelte";
	import TokenSelector from "./tokenSelector.svelte";
	import { SyncLoader } from 'svelte-loading-spinners';
	import { createEventDispatcher } from "svelte";
	import Tooltip from "../general/tooltip.svelte";

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


<div id="{id}-container" class='bg-white dark:bg-zinc-800 rounded-xl p-3'>
    <div class="flex justify-between">
        <TokenSelector bind:value={selectedToken} selectedTokens={selectedTokens} defaultToken={defaultToken} on:switch={()=>{dispatch('switch')}}/>
        {#if selectedToken?.address}
            <div
                role="button"
                class="opacity-50 hover:opacity-100 mt-1"
                on:click={() => {
                    dispatch('switch');
                }}
                on:keyup
                >
                <Tooltip
                    content="Switch tokens only"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>  
                </Tooltip>                
            </div>
        {/if}
    </div>
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
            <div class="opacity-50 text-sm font-light mb-3">
                Balance: {(balance/(Math.pow(10, decimals)))||'0'}
            </div>
        {/if}
    </div>
    {#if loading}
        <div class="flex items-center">
            <SyncLoader size="40" color="#94949450" unit="px" duration="1s"/>
            <span class="text-4xl opacity-0 py-3">0</span>
        </div>
    {/if}
</div>