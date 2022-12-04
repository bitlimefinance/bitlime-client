<script lang="ts">
	import Button from "../general/button.svelte";
    import Fuse from 'fuse.js'
	import FullScreenContainer from "../general/fullScreenContainer.svelte";
	import { selectedNetwork, tokensList } from "$lib/stores/application";
	import { readLocalStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
	import { createEventDispatcher, onMount } from "svelte";

    export let value: any;
    export let defaultToken: string = '';
    export let selectedTokens: Array<any> = [];
    
    const dispatch = createEventDispatcher();

    let nativeCoin: any;

    selectedNetwork.subscribe((value)=>{
        nativeCoin= {
                "is_native": true,
                "image": value?.logo,
                "name": value?.name,
                "symbol": value?.currency_symbol,
                "decimals": value?.decimals,
                "chain_id": value?.id,
                "address": "native",
            }
    });

    let searchInputFocused: boolean;

    const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 0.1,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "name",
            "symbol",
            {
                name: "address",
                weight: 0.5
            }
        ]
    };

    let recentTokens: any = '[]';
    let parsedRecentTokens: any = [];

    let fuse = new Fuse($tokensList, options);
    let showModal: boolean = false;

    let tokensToShow: Array<any> = $tokensList;

    const searchTokens = (e: Event) => {
        // Change the pattern
        let pattern = e.target?.value;
        let searchResult = fuse.search(pattern);
        
        if(!pattern || pattern=='') tokensToShow = $tokensList;
        else tokensToShow = searchResult.map((item: any) => item.item);
    }

    tokensList.subscribe((data) => {
        tokensToShow = data;
        fuse = new Fuse(data, options);
        if(defaultToken && defaultToken!='') {  
            let searchResult = fuse.search(defaultToken);
            value = searchResult[0]?.item;
        }
    })

    selectedNetwork.subscribe(() => {
        recentTokens = readLocalStorage('recent-tokens') || '[]';
        parsedRecentTokens = JSON.parse(recentTokens);
    })

    const onSelect = (token: any) => {
        try{
            if(selectedTokens.includes(token?.address)){
                dispatch('switch');
            } else {
                value = token;
            }
        }catch(e){
            console.error(e);
        }finally{
            showModal = false;
        }
    }

    onMount(() => {
        recentTokens = readLocalStorage('recent-tokens') || '[]';
        parsedRecentTokens = JSON.parse(recentTokens);
    });
</script>

<div class="flex space-x-1 items-center cursor-pointer bg-zinc-400 bg-opacity-10 w-fit rounded-lg p-2" on:click={() => showModal = true} on:keyup>
    <Button
        label="{value?.symbol?value.symbol:'Select a token'}"
        classList="bg-transparent font-semibold"
        image="{value?.image?value.image:''}"
        />
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>                              
    </div>
</div>

{#if showModal}
    <FullScreenContainer noPadding>
        <div class="w-90 max-w-sm bg-transparent dark:border-gray-700">
            <div class="p-4">
                <div class="flex justify-between mb-4">
                    <h5 class="text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                        Select a token
                    </h5>
                    <div on:click={()=>{showModal = false}} on:keyup class="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Recent tokens</p>
                <div class="grid grid-cols-3 gap-1 mt-2 {parsedRecentTokens&&parsedRecentTokens.length>0?'':'hidden'}">
                    {#each parsedRecentTokens as token}
                        {#if token?.symbol && token?.chain_id==$selectedNetwork?.id}
                            <div
                                on:click={()=>{onSelect(token)}}
                                on:keyup
                                class="flex justify-start items-center w-fit min-w-fit gap-2 cursor-pointer p-2 rounded-lg border dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                >
                                <img src={token.image} alt="" class="h-6 w-6"/>
                                <span class="flex-1 font-medium mr-2 w-fit">{token.symbol?.toUpperCase() || '-'}</span>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="flex justify-start items-center border-t dark:border-zinc-800 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-zinc-200 dark:text-zinc-500 {searchInputFocused?'text-zinc-800 dark:text-zinc-200':''}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>                  
                <input
                    on:change={(e)=>{searchTokens(e)}}
                    on:focusin={()=>{searchInputFocused = true}}
                    on:focusout={()=>{searchInputFocused = false}}
                    type="text"
                    placeholder="Search by name, symbol or address"
                    class="w-full focus:outline-0 focus:ring-0 hover:outline-0 hover:ring-0 bg-transparent border-0 dark:border-zinc-800"
                    />
            </div>
            <ul class="space-y-2 w-full h-80 min-h-80 max-h-80 overflow-auto border-t dark:border-zinc-800">
                {#if !(selectedTokens?.includes('native'))}
                    <li class="w-full">
                        <div
                            on:click={() => {
                                try{
                                    value = nativeCoin;
                                    showModal = false;
                                }catch(e){
                                    console.error(e);
                                }
                            }}
                            on:keyup
                            class="flex items-center cursor-pointer px-4 py-2.5 text-base font-bold text-gray-900 bg-transparent hover:bg-gray-50 group dark:hover:bg-zinc-800 dark:text-white"
                            >
                            <img src={nativeCoin.image} alt="" class="h-6 w-6"/>
                            <div class="ml-2 flex items-center justify-between w-full">
                                <span class="flex-1 whitespace-nowrap">{nativeCoin.symbol || '-'}</span>
                                <span class="w-fit text-xs bg-zinc-200 dark:bg-zinc-800 px-1 rounded-full text-zinc-500 dark:text-zinc-400 font-normal">Native coin</span>
                            </div>
                        </div>
                    </li>
                {/if}
            {#each tokensToShow as token}
                {#if token?.address && token?.chain_id==$selectedNetwork?.id}
                    <li class="w-full">
                        <div
                            on:click={() => {
                                try{
                                    onSelect(token);
                                    recentTokens = readLocalStorage('recent-tokens') || '[]';
                                    parsedRecentTokens = JSON.parse(recentTokens) || [];
                                    let recentTokensAddresses = parsedRecentTokens?.map((t) => t?.address);
                                    if (!recentTokensAddresses?.includes(token.address)) {
                                        if (parsedRecentTokens.length >= 6) parsedRecentTokens.shift();
                                        parsedRecentTokens = [...parsedRecentTokens,token];
                                        writeLocalStorage('recent-tokens', JSON.stringify(parsedRecentTokens));
                                    }
                                }catch(e){
                                    console.error(e);
                                }
                            }}
                            on:keyup
                            class="flex items-center cursor-pointer px-4 py-2.5 text-base font-bold text-gray-900 bg-transparent hover:bg-gray-50 group dark:hover:bg-zinc-800 dark:text-white"
                            >
                            <img src={token.image} alt="" class="h-6 w-6"/>
                            <div class="ml-2 flex flex-col">
                                <span class="flex-1 whitespace-nowrap">{token.name || '-'}</span>
                                <span class="flex-1 whitespace-nowrap text-sm text-zinc-300 dark:text-zinc-500 font-normal">{token.symbol?.toUpperCase() || ''}</span>
                            </div>
                        </div>
                    </li>
                {/if}
            {/each}
            {#if tokensToShow?.length == 0}
                <li class="flex justify-center items-center h-40">
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">No tokens found</p>
                </li>
            {/if}
            </ul>
        </div>
    </FullScreenContainer>
{/if}