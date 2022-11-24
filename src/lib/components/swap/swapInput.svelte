<script lang="ts">
	import { _WALLETS } from "$lib/globals";
	import { connected } from "$lib/stores/application";
	import Button from "../general/button.svelte";
	import Input from "../general/input.svelte";
	import TokenSelector from "./tokenSelector.svelte";

    export let id: string = 'swap-input';
    export let value: number;
    export let disabled: boolean = false;
    export let defaultToken: string = '';
    export let selectedToken: any = {};
    export let balance: any = 0;
    export let decimals: any = 18;
    export let selectedTokens: Array<any> = [];

    export let input: HTMLInputElement;
    let inputIsFocused:boolean = false;


</script>


<div id="{id}-container" class='bg-white dark:bg-zinc-800 rounded-xl p-3'>
    <div class="flex justify-between">
        <TokenSelector bind:value={selectedToken} selectedTokens={selectedTokens} defaultToken={defaultToken}/>
    </div>
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