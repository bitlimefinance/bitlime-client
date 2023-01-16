
<script lang="ts">
    import SelectNetwork from "$lib/components/connect/selectNetwork.svelte";
	import Button from "$lib/components/general/button.svelte";
    import { _themes } from "$lib/globals";
    import { theme } from "$lib/stores/ui-theming";
    import { accounts, selectedNetwork, selectNetwork } from "$lib/stores/application";
	import { getAddressPreview } from "$lib/core/sdk/web3/utils/addresses/lib";
	import Icon from "$lib/components/general/icon.svelte";
</script>

<div id="blw" class="h-32 w-full border">
    <section id="blw-nav" class="w-full flex justify-between items-center px-2.5 py-3.5 border-b">
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
                classList="text-zinc-100 disabled:opacity-60 border font-medium rounded-full text-sm px-4 py-2 text-center disabled:opacity-80 disabled:btn-ghost disabled:cursor-default"
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
    <section id="blw-account-info" class="border-b py-2">
        <div class="flex justify-center items-center gap-2">
            <div>
                {getAddressPreview($accounts[0])}
            </div>
            <Icon icon="clipboard" outline classList="cursor-pointer hover:opacity-70" size={4}/>
        </div>
    </section>
</div>
<SelectNetwork />