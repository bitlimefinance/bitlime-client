<script lang="ts">
	import { _themes } from "$lib/globals";
	import { latestBlock } from "$lib/stores/application";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import Spinner from "$lib/components/general/spinner.svelte";
	
	let refreshTimer: number;
	let tokenA: any;
	let tokenB: any;
</script>

<svelte:head>
	<title>BitLime - The future of DeFi</title>
</svelte:head>

<main class="flex flex-col min-w-full px-5" style="height: 90vh;">
	<div class="h-10"/>
	<div class="flex justify-center my-auto w-full">
		{#await import("$lib/components/swap/swap.svelte")}
			<Spinner size='30'/>
		{:then swapComponent}
			<svelte:component this={swapComponent.default} bind:refreshTimer={refreshTimer} bind:selectedTokenA={tokenA} bind:selectedTokenB={tokenB}/>
		{/await}
	</div>
	<div class="w-full flex justify-between">
		<div class="text-xs text-emerald-200 font-medium dark:font-normal dark:text-zinc-700">
			{#if tokenA?.address || tokenB?.address}
				Updating in {refreshTimer}
			{/if}
		</div>
		
		<Tooltip invertX invertY content="Latest block number">
			<div class="flex items-center text-sm cursor-default">
				<span class="text-green-500">
					{parseInt($latestBlock, 16)||'-'}
				</span>
				<div class="animate-pulse rounded-full h-2 w-2 ml-2 bg-green-500"></div>
			</div>
		</Tooltip>
	</div>
</main>
