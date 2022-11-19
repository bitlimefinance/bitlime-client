<script lang="ts">
	import { createEventDispatcher } from "svelte";

    export let options: Array<string>=[]; // format: [['Option1 name', 'option1Value'],...]
    export let defaultOption: string='';
    export let allowEmpty: boolean=true;
    export let emptyOptionText: string = 'Select an option';
    export let id: string=''
    export let fixedValue: string = '';
    export let classList: string="border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-0 ring-0";
    export let isDisabled: boolean=false;

    export let value: string;

    const dispatch = createEventDispatcher();

    // const dispatchOnClick = (e) => {
    //     dispatch('click', {target: e});
    // }
    const dispatchOnChange = (e: Event) => {
        value = e.target?.value;
        dispatch('change', {target: e.target});
    }
</script>

<select disabled={isDisabled} on:change={(e)=>{dispatchOnChange(e)}} id={id} class={classList+(isDisabled?' opacity-50':'')}>
    <option disabled={!allowEmpty} selected={!defaultOption||defaultOption==''?true:false} value=''>{emptyOptionText}</option>
    {#each options as option}
        <option selected={defaultOption&&defaultOption==option[1]?true:false} value={fixedValue&&fixedValue!=''?fixedValue:option[1]}>{option[0]}</option>
    {/each}
</select>