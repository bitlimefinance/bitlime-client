<script lang="ts">
	import FullScreenContainer from "../general/fullScreenContainer.svelte";
	import { chainsList, selectedNetwork, selectNetwork } from "$lib/stores/application";
	import { writeLocalStorage } from "$lib/core/utils/localStorage";
	import { showLoading } from "$lib/stores/ui-theming";

    const setChain = (chain: any) => {
        try {
            showLoading.set(true);
            selectedNetwork.set(chain);
            writeLocalStorage('last-selected-chain', JSON.stringify(chain));
        } catch (error) {
            console.error(error);
        } finally {
            selectNetwork.set(false);
            showLoading.set(false);
        }
    };

    $: showModal = $selectNetwork;
</script>

<FullScreenContainer bind:show={showModal} noPadding>
    <div class="w-80 max-w-sm bg-transparent rounded-xl">
        <div class="flex justify-between px-4 pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div class="text-lg font-medium">
                Mainnet
            </div>
            <div on:click={()=>{selectNetwork.set(false)}} on:keyup class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:opacity-60">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        <ul>
            {#each $chainsList as chain}
                {#if chain.enabled && !chain.is_testnet}
                    <li>
                        <div
                            on:click={()=>{setChain(chain)}}
                            on:keyup
                            class="flex items-center cursor-pointer p-3 text-base text-zinc-900 bg-transparent hover:bg-gray-50 group hover:shadow dark:hover:bg-zinc-800 dark:text-white"
                            >
                            <img src={chain.logo} alt="" class="h-6 w-6 rounded-md"/>
                            <span class="flex-1 ml-3 whitespace-nowrap">{chain.name}</span>
                        </div>
                    </li>
                {/if}
            {/each}
        </ul>
        <div class="text-lg font-medium px-4 py-2 mt-4 border-b border-zinc-200 dark:border-zinc-800">
            Testnet
        </div>
        <ul class="rounded-b-lg overflow-hidden">
            {#each $chainsList as chain,i}
                {#if chain.enabled && chain.is_testnet}
                    <li>
                        <div
                            on:click={()=>{setChain(chain)}}
                            on:keyup
                            class="flex items-center cursor-pointer p-3 text-base text-zinc-900 bg-transparent hover:bg-gray-50 group hover:shadow dark:hover:bg-zinc-800 dark:text-white"
                            >
                            <img src={chain.logo} alt="" class="h-6 w-6 rounded-md"/>
                            <span class="flex-1 ml-3 whitespace-nowrap">{chain.name}</span>
                        </div>
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
</FullScreenContainer>