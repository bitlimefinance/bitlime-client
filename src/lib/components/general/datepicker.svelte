<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let min: string = '';
    export let max: string = '';
    export let format: string = 'yyyy-MM-dd';
    export let classList: string = 'rounded-lg border-gray-300 ring-0 outline-0 w-full';
    export let id: string = '';
    export let defaultValue: string ='';
    export let placeholder: string ='yyyy-mm-dd';
    export let required: boolean =false;
    export let noBorder: boolean =false;

    let value: string ='';

    const defaultValueUpdated = () => {
        if (defaultValue&&defaultValue!='') {
            dispatch('change', {
                value: defaultValue,
            });
        }
    };

    $: defaultValue, defaultValueUpdated();
</script>

<input
    on:change={(e) => {
        value=e.target.value;
        dispatch('change', {value: e.target.value})
        }}
    type="date"
    id={id&&id!='' ? id : randomString(5)}
    placeholder={placeholder}
    value={defaultValue}
    min={min}
    max={max}
    pattern={format}
    required={required}
    class={`text-${(defaultValue&&defaultValue!='')||(value&&value!='')?'black':'gray-400'} ${classList} qai-date-input ${noBorder?'border-0 rounded-none':''}`}
    >