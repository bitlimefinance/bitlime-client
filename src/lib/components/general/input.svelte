<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";

	export let label: string = '';
	export let id: string = 'input-'+randomString(8);
	export let value: any;
	export let additionalClasses: string = '';
	export let showRequiredStar: boolean = false;
	export let style: string = '';
	export let type: string = 'text';
	export let disabled: boolean = false;
	export let isFocused: boolean = false;
	export let input: HTMLElement;
	export let placeholder: string = '';
</script>

<div>
	{#if label && label!=''}
		<label
			for={id}
			class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
			>{label} <span class={showRequiredStar ? 'text-red-600' : 'hidden'}>*</span></label
		>
	{/if}
	{#if type == 'text'}
		<input
			on:input
			on:focusin={()=>{isFocused = true}}
			on:focusout={()=>{isFocused = false}}
			bind:value
			bind:this={input}
			disabled={disabled}
			placeholder={placeholder}
			id={id}
			type='text'
			class={'rounded-lg block w-full outline-0 ring-0 hover:outline-0 hover:ring-0 hover:border-0 focus:outline-0 focus:border-0 focus:ring-0 ' + additionalClasses}
			style={style}
			/>
	{:else if type == 'number'}
		<input
			on:input
			on:focusin={()=>{isFocused = true}}
			on:focusout={()=>{isFocused = false}}
			bind:value
			bind:this={input}
			disabled={disabled}
			placeholder={placeholder}
			id={id}
			type='number'
			class={'rounded-lg block w-full outline-0 ring-0 hover:outline-0 hover:ring-0 hover:border-0 focus:outline-0 focus:border-0 focus:ring-0 ' + additionalClasses}
			style={style}
			/>
	{:else if type == 'textarea'}
		<textarea
			on:input
			on:focusin={()=>{isFocused = true}}
			on:focusout={()=>{isFocused = false}}
			bind:value
			bind:this={input}
			disabled={disabled}
			placeholder={placeholder}
			id={id}
			class={'rounded-lg block w-full outline-0 ring-0 hover:outline-0 hover:ring-0 hover:border-0 focus:outline-0 focus:border-0 focus:ring-0 ' + additionalClasses}
			style={style}
			/>
	{/if}
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
	}

	/* Firefox */
	input[type=number] {
	-moz-appearance: textfield;
	}
</style>