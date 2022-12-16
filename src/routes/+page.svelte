<script lang="ts">
	import { _themes } from "$lib/globals";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import Spinner from "$lib/components/general/spinner.svelte";
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	
	let tokenA: any;
	let tokenB: any;
</script>

<svelte:head>
	<title>BitLime - The future of DeFi</title>
</svelte:head>

<div class="flex justify-center my-auto w-full" style="padding-top: min(200px, 8%);">
	{#await import("$lib/components/swap/swap.svelte")}
		<FullScreenContainer noBg alwaysShow>
			<Spinner size='30'/>
		</FullScreenContainer>
	{:then swapComponent}
		<svelte:component this={swapComponent.default} bind:selectedTokenA={tokenA} bind:selectedTokenB={tokenB}/>
	{/await}
</div>
