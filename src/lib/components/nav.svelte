<script lang="ts">
	import { getChainsList } from "$lib/core/contents/apis";
	import { chains } from "$lib/core/contents/fallbacks";
	import { readLocalStorage } from "$lib/core/utils/localStorage";
	import { getAddressPreview } from "$lib/core/sdk/web3";
	import { _themes, _WALLETS, _WALLETS_INFO } from "$lib/globals";
	import { accounts, chainsList, connected, selectedNetwork, selectNetwork, showConnenct } from "$lib/stores/application";
	import { theme } from "$lib/stores/ui-theming";
	import { onMount } from "svelte";
	import ConnectModal from "./connect/connectModal.svelte";
	import SelectNetwork from "./connect/selectNetwork.svelte";
	import Button from "./general/button.svelte";
	import ThemeToggle from "./themeToggle.svelte";
	import { page } from "$app/stores";

  export let element: HTMLElement;

  onMount(async () => {
        getChainsList().then((data) => {
          if (data?.results && data?.results.length > 0) chainsList.set(data?.results);
          else chainsList.set(chains);
        })
        try {
          let currentChain = readLocalStorage('last-selected-chain');
          if (currentChain) {
            let parsedChain = JSON.parse(currentChain);
            if (parsedChain?.id) selectedNetwork.set(parsedChain);
          }
        } catch (error) {
          /* do nothing */
        }
    });

    const LINKS: {text: string, route: string}[] = [
      {
        text: 'Swap',
        route: '/',
      },
      {
        text: 'Pools',
        route: '/pools',
      },
      {
        text: 'Farms',
        route: '/farms',
      },
      {
        text: 'Staking',
        route: '/staking',
      },
      {
        text: 'Docs',
        route: 'https://docs.bitlime.io',
      }
    ];
</script>

<nav class="flex justify-between items-center bg-transparent px-5 py-4" bind:this={element}>
    <div class="flex justify-start items-center">
        <a href="/" class="flex justify-start items-center btn btn-ghost normal-case text-lg mr-5">
            <img src="/assets/bl-logos/{$theme==_themes.dark?'logo.png':'logo-black.png'}" alt="logo" class="h-8 mr-1" />
            <span class="font-medium dark:font-normal text-xl dark:text-emerald-500 sr-only">BitLime</span>
        </a>
        {#each LINKS as link}
          <a href={link.route} class="btn btn-ghost normal-case font-medium hover:bg-zinc-600/[0.2] dark:text-zinc-200 rounded-md py-1 px-2 text-md {$page.route?.id==link.route?'border-b border-green-500':''}">{link.text}</a>
        {/each}
    </div>
    <div class="flex justify-end items-center gap-3">
      <ThemeToggle/>
      <Button
        label={$selectedNetwork&&$selectedNetwork.name?$selectedNetwork.name:'Select a network'}
        badge={$selectedNetwork&&$selectedNetwork.is_testnet?'TESTNET':''}
        image={$selectedNetwork&&$selectedNetwork.logo?$selectedNetwork.logo:''}
        imageRounded
        theme="tertiary"
        on:click={()=>{selectNetwork.set(true)}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>                
      </Button>
      {#if $connected&&$connected!=_WALLETS.DISCONNECTED}
        <Button
          label={getAddressPreview($accounts[0])}
          theme="tertiary"
          on:click={()=>{}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
            </svg>          
        </Button>
      {:else}
        <Button
          label="Connect wallet"
          theme="tertiary"
          on:click={()=>{showConnenct.set(true)}}
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
          </svg> 
        </Button>
      {/if}
    </div>
</nav>

<ConnectModal/>
<SelectNetwork/>
