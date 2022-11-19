<script lang="ts">
	import Tooltip from './tooltip.svelte';
	export let text: string = '';
	export let size: string = '5';
	export let grayLevel: string = '400';
</script>

<Tooltip content={text}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={`h-${size} w-${size} text-gray-${grayLevel}`}
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
</Tooltip>
