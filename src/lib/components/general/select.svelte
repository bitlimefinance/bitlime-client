<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";
	import { createEventDispatcher } from "svelte";

    export let options: Array<string[]>=[]; // format: [['Option1 name', 'option1Value'],...]
    export let defaultOption: string='';
    export let allowEmpty: boolean=true;
    export let emptyOptionText: string = 'Select an option';
    export let id: string=randomString(8);
    export let fixedValue: string = '';
    export let isDisabled: boolean=false;
    export let label: string = '';
    export let maxWidth: string = "100%";

    export let value: string;

    let selectElement: HTMLSelectElement;

    const dispatch = createEventDispatcher();

    // const dispatchOnClick = (e) => {
    //     dispatch('click', {target: e});
    // }
    const dispatchOnChange = (e: Event) => {
        value = e.target?.value;
        dispatch('change', {target: e.target});
    }
</script>

<div class="flex flex-col gap-2 w-full">
    {#if label}
        <p class="text-zinc-900 dark:text-white font-medium text-sm text-start w-full">
            {label}
        </p>
    {/if}
    <select
        bind:this={selectElement}
        disabled={isDisabled}
        on:change={(e)=>{dispatchOnChange(e)}}
        id={id}
        style="max-width: {maxWidth}"
        class="disabled:opacity-50 my-auto border border-zinc-300 text-zinc-900 text-sm rounded-lg dark:bg-zinc-700 dark:border-zinc-600 py-2 px-1.5 focus:outline-0 focus:ring-0 block w-full dark:placeholder-zinc-400 {value?"dark:text-white":"dark:text-zinc-400"} outline-0 ring-0"
        >
        <option disabled={!allowEmpty} selected={!defaultOption||defaultOption==''?true:false} value=''>{emptyOptionText}</option>
        {#each options as option}
            <option selected={defaultOption&&defaultOption==option[1]?true:false} value={fixedValue&&fixedValue!=''?fixedValue:option[1]}>{option[0]}</option>
        {/each}
    </select>
</div>