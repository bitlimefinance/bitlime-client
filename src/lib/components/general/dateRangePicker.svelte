<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Datepicker from './datepicker.svelte';

    const dispatch = createEventDispatcher();

	export let format = 'MM-dd-yyyy';
    export let placeholder = 'yyyy-mm-dd';
    export let minStart='';
    export let minEnd='';
    export let maxStart='';
    export let maxEnd='';
    // export let closeOnSelection = true;
    export let defaultStart = '';
    export let defaultEnd = '';
    export let labelStart = '';
    export let labelEnd = '';
    export let idStart = 'start-date-input';
    export let idEnd = 'end-date-input';
    export let startRequired = false;
    export let endRequired = false;
    export let noBorder=false;

    export let range=[];

    const dateChanged = (e) => {
        let startDatePicker = document.getElementById(idStart);
        let endDatePicker = document.getElementById(idEnd);
        if (Date.parse(startDatePicker.value) > Date.parse(endDatePicker.value)) {
            endDatePicker.value=startDatePicker.value;
        }
        range=[startDatePicker.value, endDatePicker.value];
        dispatch('change', {
            startDate: startDatePicker.value,
            idStart: idStart,
            endDate: endDatePicker.value,
            idEnd: idEnd
        });
    }

    onMount(()=>{
        let startDatePicker = document.getElementById(idStart);
        let endDatePicker = document.getElementById(idEnd);
        if (startDatePicker?.value && endDatePicker?.value) {
            dispatch('mount', {
                startDate: startDatePicker.value,
                idStart: idStart,
                endDate: endDatePicker.value,
                idEnd: idEnd
            });
        }
    })
</script>

<div class="flex flex-row gap-3 w-full">
    <div class="flex flex-row gap-2 items-center w-full">
        {#if labelStart}<div class="w-full text-start text-sm">{labelStart}</div>{/if}
        <Datepicker on:change={(e)=>{dateChanged(e)}} id={idStart} defaultValue={defaultStart} format={format} min={minStart} max={maxStart} placeholder={placeholder} required={startRequired} noBorder={noBorder}/>
    </div>
    <div class="qai-date-picker flex flex-col gap-2 items-center w-full">
        {#if labelEnd}<div class="w-full text-start text-sm">{labelEnd}</div>{/if}
        <Datepicker on:change={(e)=>{dateChanged(e)}} id={idEnd} defaultValue={defaultEnd} format={format} min={minEnd} max={maxEnd} placeholder={placeholder} required={endRequired} noBorder={noBorder}/>
    </div>
</div>