<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Icon from "$lib/components/general/icon.svelte";
	import Popup from "$lib/components/general/popup.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { balanceOf, totalSupply } from "$lib/core/sdk/erc20";
    import { FACTORY_ABI, FACTORY_ADDRESS } from "$lib/core/sdk/factory";
	import { LMC_ADDRESS } from "$lib/core/sdk/lime";
	import { readSmartContract } from "$lib/core/sdk/web3/contracts/lib";
	import { web3Ready_ } from "$lib/core/sdk/web3/provider/lib";
	import { bigNumberToShort, changeRoute, formatNumber } from "$lib/core/utils/utilities";
	import { accounts, showConnenct } from "$lib/stores/application";
	import { mainHeight_ } from "$lib/stores/ui-theming";

    let nToLoad: number = 50;
    let poolsData: any;

    let limeBalance: number;
    let limeSupply: number;
    $: normalizedLimeBalance = (limeBalance/(Math.pow(10, 18)))||0;
    $: normalizedLimeSupply = (limeSupply/(Math.pow(10, 18)))||0;

    let showInfo: boolean = false;

    const getPoolData = async () => {
        let nOfPairs = await readSmartContract({
            abi: FACTORY_ABI,
            address: FACTORY_ADDRESS,
            methodName: "allPairsLength",
            methodParams: [],
        });
    }
    web3Ready_.subscribe((ready) => {
        if (ready) {
            getPoolData();
        }
    });
    accounts.subscribe(async () => {
        if(!limeBalance) limeBalance = await balanceOf({ address: $accounts[0], tokenAddress: LMC_ADDRESS });
        if(!limeSupply) limeSupply = await totalSupply({tokenAddress: LMC_ADDRESS});
    })
</script>

<svelte:head>
	<title>Earn - Bitlime</title>
</svelte:head>

<div class="w-full" style="min-height: {$mainHeight_}px;">

    <Popup
        bind:showModal={showInfo}
        title="How does this work?"
        content={`
            <div class="font-bold mb-3">Hold to earn:</div>
            By holding Lime Coins, users can earn passive income from the trading activity of others on the platform.
            <span class="block mt-4">
            The amount of fees distributed to token holders is determined by the amount of Lime coins they hold.
            </span>
            <div class="font-bold mb-3 pt-4 mt-4 border-t dark:border-t-zinc-700">Provide liquidity:</div>
            <span class="block mb-4">
            Users can also earn passive income by providing liquidity to the pools.
            </span>
            Providing liquidity means that users depost Lime Coins and the corresponding token in a pool, and earn a share of the trading fees generated by the pool.
        `}
    />

    <div class="mt-20 mb-14 ">
        <div>
            <h1 class="text-5xl font-semibold text-zinc-900 dark:text-white mb-4">Invest</h1>
            <div class="flex justify-start items-center gap-3">
            <Button
                label="How does this work?"
                on:click={() => {
                    showInfo = !showInfo;
                }}
            />
            {#if $accounts.length > 0}
            <Button
                label="Get Lime Coin"
                theme="tertiary"
                additionalClassList="min-w-full"
                on:click={() => {
                    changeRoute("");
                }}
                >
                <img src="https://s3.amazonaws.com/appforest_uf/f1672795465986x941733576005006300/logo-white.png" alt="Lime" class="w-4 h-4 mt-0.5"/>
            </Button>
            {:else}
            
            <Button
                label="Connect wallet"
                theme="tertiary"
                additionalClassList="min-w-full"
                on:click={()=>{showConnenct.set(true)}}
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                </svg> 
            </Button>
            {/if}
            </div>
        </div>
    </div>

    <div class="mb-6 w-full">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Hold Lime to earn</h2>
                <h3 class="font-light text-zinc-900 dark:text-white">
                    You can earn <span class="font-medium">passive income</span> by simply by owning Lime Coins.
                </h3>
            </div>
        </div>
        <div
            class="px-5 py-3 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800/[0.4] mt-5 flex items-center"
            >
            <div class="grid grid-cols-5 cursor-default divide-x divide-zinc-700 w-full">
                <div class="w-fit">
                    <Tooltip content="Amount of Lime Coins (LMC) you own">
                        <div class="flex items-center gap-2 mb-3 font-semibold text-zinc-900 dark:text-white">
                            Your Balance
                            <!-- <img src="https://s3.amazonaws.com/appforest_uf/f1672667514508x454963896560584450/lime.png" alt="Lime" class="w-6 h-6 mr-2"/> -->
                        </div>
                        {formatNumber(normalizedLimeBalance, 'number', 0, 18)}
                    </Tooltip>
                </div>
                <div class="pl-3 w-fit">
                    <div class="mb-3 font-semibold text-zinc-900 dark:text-white">
                        <Tooltip content="Annual Percentage Rate">
                            APR (1y)
                        </Tooltip>
                    </div>
                    {formatNumber(9, 'percent', 2, 4)}
                </div>
                <div class="pl-3 w-fit">
                    <div class="mb-3 font-semibold text-zinc-900 dark:text-white">
                        LMC/USD
                    </div>
                    {formatNumber(1.3, 'currency', 2, 2)}
                </div>
                <div class="pl-3 w-fit">
                    <div class="mb-3 font-semibold text-zinc-900 dark:text-white">
                        Tot. Supply
                    </div>
                    <Tooltip content="Total number of Lime coins in circulation" title={formatNumber(normalizedLimeSupply)} invertX>
                        {bigNumberToShort(normalizedLimeSupply)}
                    </Tooltip>
                </div>
                <div class="pl-3 w-fit">
                    <div class="mb-3 font-semibold text-zinc-900 dark:text-white">
                        Your share
                    </div>
                    <Tooltip content="Total number of Lime coins in circulation" title={formatNumber(10000000000)} invertX>
                        {formatNumber(((normalizedLimeBalance/normalizedLimeSupply)*100), 'percent',2)}
                    </Tooltip>
                </div>
            </div>
            <Button
                label="Get"
                additionalClassList="h-fit min-w-full"
                on:click={() => {
                    changeRoute("");
                }}
                >
                <img src="https://s3.amazonaws.com/appforest_uf/f1672795465986x941733576005006300/logo-white.png" alt="Lime" class="w-4 h-4 mt-0.5"/>
            </Button>
        </div>
    </div>

    <!-- POOLS -->
	<div class="flex justify-between items-end py-5 w-full mt-10">
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Pools</h2>
        <Button
            label="Provide Liquidity"
            additionalClassList="h-fit"
            theme="tertiary"
            on:click={() => {
                changeRoute("pools/create");
            }}
            >
            <div class="text-white icon-w-4">
                <Icon icon="plus"/>
            </div>
        </Button>
    </div>
    <section class="rounded-lg dark:border-zinc-700 overflow-hidden">
        <ul>
            <li>
                <div class="bg-white dark:bg-zinc-800/[0.6] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="bg-white dark:bg-zinc-800/[0.1] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="bg-white dark:bg-zinc-800/[0.6] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="bg-white dark:bg-zinc-800/[0.1] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="bg-white dark:bg-zinc-800/[0.6] h-12 w-full">
                </div>
            </li>
        </ul>
    </section>
</div>
