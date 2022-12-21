<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Icon from "$lib/components/general/icon.svelte";
    import { FACTORY_ABI, FACTORY_ADDRESS } from "$lib/core/sdk/factory";
	import { readSmartContract, web3Ready_ } from "$lib/core/sdk/web3";
	import { changeRoute } from "$lib/core/utils/utilities";
	import { mainHeight_ } from "$lib/stores/ui-theming";
	import { onMount } from "svelte";
    let nToLoad: number = 50;
    let poolsData: any;
    const getPoolData = async () => {
        let nOfPairs = await readSmartContract({
            abi: FACTORY_ABI,
            address: FACTORY_ADDRESS,
            methodName: "allPairsLength",
            methodParams: [],
        });
        console.log(nOfPairs);
    }
    web3Ready_.subscribe((ready) => {
        if (ready) {
            getPoolData();
        }
    });
</script>

<svelte:head>
	<title>Pools - Bitlime</title>
</svelte:head>

<div class="p-10 my-auto w-full" style="min-height: {$mainHeight_}px;">
	<header class="flex justify-between items-center py-5 mb-5 border-b border-b-zinc-500/[0.3] w-full">
        <h1 class="text-6xl font-semibold text-zinc-900 dark:text-white">Pools</h1>
        <Button
            label="Create Pool"
            type="secondary"
            additionalClassList="h-fit"
            on:click={() => {
                changeRoute("pools/create");
            }}
            >
            <div class="text-white icon-w-4">
                <Icon icon="plus"/>
            </div>
        </Button>
    </header>
    <section>
        <ul>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
        </ul>
    </section>
</div>
