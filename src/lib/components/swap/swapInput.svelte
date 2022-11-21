<script lang="ts">
	import Button from "../general/button.svelte";
	import Input from "../general/input.svelte";
	import TokenSelector from "./tokenSelector.svelte";

    export let id: string = 'swap-input';
    export let value: number;
    export let disabled: boolean = false;
    export let defaultToken: string = '';
    export let selectedToken: any = {};

    export let input: HTMLInputElement;
    let inputIsFocused:boolean = false;


</script>


<div id="{id}-container" class='bg-white dark:bg-zinc-800 rounded-xl p-3'>
    <TokenSelector bind:value={selectedToken} defaultToken={defaultToken}/>
    <Input
        bind:isFocused={inputIsFocused}
        bind:value
        bind:input={input}
        placeholder="0.00"
        disabled={disabled}
        id={id}
        type="number"
        additionalClasses="text-4xl w-full bg-transparent border-0"
        />
</div>