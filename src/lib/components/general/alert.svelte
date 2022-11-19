<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";
	import { createEventDispatcher } from "svelte";
	import { onMount } from "svelte";

    export let id: string ='';
    export let content: string ='';
    export let bgColor: string ='red-100';
	export let bgColorDark: string ='red-200';
    export let showByDefault: boolean =false;

    const dispatch = createEventDispatcher();

    if (!id||id=='') id=`alert-${randomString(5)}`;

	const closeAlert = () => {
		let alertEl = document.getElementById(id);
		if (alertEl) {
			alertEl.classList.add('hidden');
            dispatch('close', {id: id});
		}
	};
	const showAlert = () => {
		let alertEl = document.getElementById(id);
		if (alertEl) {
			alertEl.classList.remove('hidden');
            dispatch('show', {id: id});
		}
	};

	onMount(() => {
		if (showByDefault) {
			showAlert();
		}
	});
</script>

<div id={id} class={`flex p-4 mb-4 bg-${bgColor} dark:bg-${bgColorDark} hidden`} role="alert">
	<svg
		aria-hidden="true"
		class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		><path
			fill-rule="evenodd"
			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
			clip-rule="evenodd"
		/></svg
	>
	<span class="sr-only">Alert</span>
	<div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
		{content}
	</div>
	<button
		on:click={() => {
			closeAlert();
		}}
		id={id+'-close-button'}
		type="button"
		class="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300"
		data-dismiss-target="#alert-2"
		aria-label="Close"
	>
		<span class="sr-only">Close</span>
		<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/></svg
		>
	</button>
</div>