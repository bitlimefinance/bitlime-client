<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Icon from "$lib/components/general/icon.svelte";
	import PopupIcon from "$lib/components/general/popupIcon.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { balanceOf } from "$lib/core/sdk/erc20";
    import { FACTORY_ABI, FACTORY_ADDRESS } from "$lib/core/sdk/factory";
	import { LIME_ADDRESS } from "$lib/core/sdk/lime";
	import { readSmartContract, web3Ready_ } from "$lib/core/sdk/web3";
	import { changeRoute, formatNumber } from "$lib/core/utils/utilities";
	import { accounts } from "$lib/stores/application";
	import { mainHeight_ } from "$lib/stores/ui-theming";

    let nToLoad: number = 50;
    let poolsData: any;
    let limeBalance: number;

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
    accounts.subscribe(async () => {
        limeBalance = await balanceOf({ address: $accounts[0], tokenAddress: LIME_ADDRESS });
    })
</script>

<svelte:head>
	<title>Pools - Bitlime</title>
</svelte:head>

<div class="p-10 my-auto w-full" style="min-height: {$mainHeight_}px;">
    <div class="mb-6 w-full">
        <div class="flex justify-between items-end">
            <div>
                <h1 class="text-3xl font-semibold text-zinc-900 dark:text-white mb-2">Staking</h1>
                <div class="flex items-center gap-2">
                    <h2 class="text-kg text-zinc-900 dark:text-white">
                        Earn trading fees from all pools on BitLime, only by <strong>holding Lime</strong>!
                    </h2>
                    <PopupIcon
                        title="How does this work?"
                        content="Staking is the locking up of cryptocurrency tokens (Lime in this case) for a certain period of time in order to earn rewards. In the case of BitLime, the rewards are trading fees from all pools on BitLime. The longer you stake, the more rewards you earn."
                    />
                </div>
            </div>
            <Button
                label="Stake Lime"
                type="secondary"
                additionalClassList="h-fit"
                on:click={() => {
                    changeRoute("pools/create");
                }}
                >
                <div class="text-white icon-w-4">
                    <Icon icon="arrow-trending-up"/>
                </div>
            </Button>
        </div>
        <div
            class="px-5 py-3 border dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 mt-5"
            >
            <div class="grid grid-cols-4 cursor-default divide-x divide-zinc-700">
                <div>
                    <div class="flex items-center gap-2 mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                        Your Limes
                        <img src="https://s3.amazonaws.com/appforest_uf/f1672667514508x454963896560584450/lime.png" alt="Lime" class="w-6 h-6 mr-2"/>
                    </div>
                    {formatNumber((limeBalance/(Math.pow(10, 18)))||0, 'currency', 0, 18, 'LMC')}
                </div>
                <div class="pl-3">
                    <div class="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                        <Tooltip content="Annual Percentage Rate">
                            APR (1y)
                        </Tooltip>
                    </div>
                    {formatNumber(9, 'percent', 2, 4)}
                </div>
                <div class="pl-3">
                    <div class="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                        LMC/USD
                    </div>
                    {formatNumber(1.3, 'currency', 2, 2)}
                </div>
                <div class="pl-3">
                    <div class="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                        Lime Holders
                    </div>
                    {formatNumber(543213)}
                </div>
            </div>
            <div>

            </div>
            <div></div>
        </div>
    </div>
	<div class="flex justify-between items-center py-5 mb-5 border-b border-b-zinc-500/[0.3] w-full">
        <h1 class="text-3xl font-semibold text-zinc-900 dark:text-white">Pools</h1>
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
    </div>
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
