<script lang="ts">
	import { blinkElement, randomString, sleep } from "$lib/core/utils/utilities";
	import { _themes } from "$lib/globals";
	import { latestBlock } from "$lib/stores/application";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import Swap from "$lib/components/swap/swap.svelte";
	import Button from "$lib/components/general/button.svelte";

	let latestBlockElement: HTMLElement;

</script>

<svelte:head>
	<title>BitLime - The future of DeFi</title>
</svelte:head>

<main class="flex flex-col min-w-full px-5" style="height: 90vh;">
	<div class="h-10"/>
	<div class="flex justify-center my-auto w-full">

		<Swap/>

	</div>
	<div class="w-full flex justify-end">
		<Tooltip invertX invertY content="Latest block number">
			<div class="flex items-center text-sm cursor-default" bind:this={latestBlockElement}>
				<span class="text-green-500">
					{parseInt($latestBlock, 16)||'-'}
				</span>
				<div class="animate-pulse rounded-full h-2 w-2 ml-2 bg-green-500"></div>
			</div>
		</Tooltip>
	</div>
</main>
