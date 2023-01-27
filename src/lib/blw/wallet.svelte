
<script lang="ts">
    import SelectNetwork from "$lib/components/connect/selectNetwork.svelte";
	import Button from "$lib/components/general/button.svelte";
    import { _themes } from "$lib/globals";
    import { theme } from "$lib/stores/ui-theming";
    import { accounts, selectedNetwork, selectNetwork } from "$lib/stores/application";
	import { getAddressBalance, getAddressPreview } from "$lib/core/sdk/web3/utils/addresses/lib";
	import Icon from "$lib/components/general/icon.svelte";
	import { onMount } from "svelte";
	import { fromWei } from "$lib/core/sdk/web3/utils/units/lib";
	import { formatNumber } from "$lib/core/utils/utilities";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import Send from "./components/walletSections/send.svelte";
	import Buy from "./components/walletSections/buy.svelte";
	import { loadWorker } from "./lib/worker/workerApi";
	import { workerLoaded } from "./lib/stores";

    let balance: string = '0';
    let loading: boolean = true;

    enum Tab {
        Send,
        Buy
    }

    let tabSelected: Tab = Tab.Send;

    accounts.subscribe(async (value) => {
        if (value && value.length > 0) {
            balance = fromWei(await getAddressBalance(value[0]), 'ether') || '0';
        }
        loading = false;
    });

    onMount(async () => {
        if(!$workerLoaded) await loadWorker();
    });
</script>

<div id="blw" class="w-full rounded-xl bg-zinc-800/[0.5] p-3" style="min-width: 300px;">
    {#if $workerLoaded}
    <section id="blw-nav" class="w-full flex justify-between items-center py-3.5 border-b">
        <div id="blw-nav-left">
            <img src="/assets/bl-logos/{$theme==_themes.dark?'logo-bold.png':'logo-bold.png'}" alt="logo" class="h-7" />
            <span class="font-medium dark:font-normal text-xl dark:text-emerald-500 sr-only">BitLime</span>
        </div>
        <div id="blw-nav-right">
            <Button
                label={$selectedNetwork&&$selectedNetwork.name?$selectedNetwork.name:'Select a network'}
                badge={$selectedNetwork&&$selectedNetwork.is_testnet?'TESTNET':''}
                image={$selectedNetwork&&$selectedNetwork.logo?$selectedNetwork.logo:''}
                imageRounded
                classList="text-zinc-100 disabled:opacity-60 border font-medium rounded-full text-sm px-3 py-2 text-center disabled:opacity-80 disabled:btn-ghost disabled:cursor-default"
                on:click={()=>{selectNetwork.set(true)}}
                >
                <div class="flex justify-center items-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </div>
            </Button>
        </div>
    </section>
    <section id="blw-account-info" class="border-b py-2 w-full flex justify-between">
        <div class="w-10"></div>
        <div>
            <div class="font-semibold text-sm w-full text-center">
                Account
            </div>
            <div class="flex justify-center items-center gap-2">
                <div>
                    {getAddressPreview($accounts[0])}
                </div>
                <Icon icon="clipboard" size={4} outline classList="cursor-pointer hover:opacity-80" on:click={()=>{
                    navigator.clipboard.writeText($accounts[0]);
                }}/>
            </div>
        </div>
        <div class="flex items-center justify-end w-10">
            <Icon icon="ellipsis-vertical" size={6} classList="cursor-pointer hover:opacity-80"/>
        </div>
    </section>
    <section id="blw-balance" class="py-5">
        <div class="w-fit mx-auto mb-4">
            <div class="h-10 w-10 rounded-full border"/>
        </div>
        <div class="w-fit flex items-center mx-auto gap-2 text-4xl font-semibold">
            <div title={balance}>
                {#if loading}
                    <SyncLoader size="40" color="#94949450" unit="px" duration="1s"/>
                {:else}
                    {formatNumber(balance, 'number', 0, 5)}
                {/if}
            </div>
            <div>
                {$selectedNetwork?.symbol || 'ETH'}
            </div>
        </div>
    </section>
    <section id="blw-tabs">
        <ul class="w-full border rounded-lg flex justify-between items-end">
            <li id="send-tab" on:click={()=>{tabSelected=Tab.Send}} on:keyup class="{tabSelected==Tab.Send?"bg-zinc-50 dark:bg-zinc-800/[0.5]":""} border-r w-full flex justify-center items-center py-3 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/[0.5]">
                Send
            </li>
            <li id="buy-tab" on:click={()=>{tabSelected=Tab.Buy}} on:keyup class="{tabSelected==Tab.Buy?"bg-zinc-50 dark:bg-zinc-800/[0.5]":""} w-full flex justify-center items-center py-3 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/[0.5]">
                Buy
            </li>
        </ul>
    </section>
    <section id="blw-tabs-content" class="w-full">
        {#if tabSelected==Tab.Send}
            <Send />
        {:else if tabSelected==Tab.Buy}
            <Buy />
        {/if}
    </section>
    {:else}
        <div class="w-full h-full flex justify-center items-center">
            <SyncLoader size="40" color="#94949450" unit="px" duration="1s"/>
        </div>
    {/if}
</div>