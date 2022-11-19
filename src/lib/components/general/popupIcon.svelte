<script lang="ts">
	import ModalProvider from './modal/modalProvider.svelte';

	export let title: string='';
	export let content: string='';
	export let size: string = '5';
	export let grayLevel: string = '400';
	export let modalId: string='';
</script>


<ModalProvider
	modalId={modalId}
	btnClassList={`text-gray-${grayLevel}`}
	btnIcon={`
		<svg
		xmlns="http://www.w3.org/2000/svg"
		class='h-${size} w-${size}'
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	`}
	onlyIcon
>
	<div class='text-2xl font-bold border-b pb-4'>{title}</div>
	<div class='mt-4'>{@html content}</div>
</ModalProvider>
