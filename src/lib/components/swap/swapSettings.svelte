<script lang="ts">
	import Button from "../general/button.svelte";
	import FullScreenContainer from "../general/fullScreenContainer.svelte";
	import { autoSlippage, deadlineStore, selectedNetwork, slippageStore, tokensList } from "$lib/stores/application";
	import { readLocalStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
	import { createEventDispatcher, onMount } from "svelte";
	import TooltipIcon from "../general/tooltipIcon.svelte";
	import Input from "../general/input.svelte";
	import Tooltip from "../general/tooltip.svelte";
    
    const dispatch = createEventDispatcher();

    let mounted: boolean = false;
    let showModal: boolean = false;

    const onToggle = () => {
        showModal = !showModal;
    }

    let slippage: number;
    let slippageInput: HTMLInputElement;

    let deadline: number;
    let deadlineInput: HTMLInputElement; 

    const onUpdate = () => {
        if(!mounted) return;
        try{
            slippageStore.set(slippage);
            deadlineStore.set(deadline);
            writeLocalStorage('autoSlippage', JSON.stringify($autoSlippage));
            writeLocalStorage('slippage', JSON.stringify(slippage));
            writeLocalStorage('deadline', JSON.stringify(deadline));
        }catch(e){
            /* do nothing */
        }
    }

    autoSlippage.subscribe(() => {
        onUpdate();
    });

    $: slippage, deadline, onUpdate();

    onMount(() => {
        try{
            autoSlippage.set(JSON.parse(readLocalStorage('autoSlippage') || 'true'));
            slippage = JSON.parse(readLocalStorage('slippage') || '0.1');
            deadline = JSON.parse(readLocalStorage('deadline') || '20');
        }catch(e){
            console.error(e);
        }
        mounted = true;
    });

</script>


<svg on:click={onToggle} on:keyup xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>

<FullScreenContainer bind:show={showModal} noPadding>
    <div class="w-80 max-w-sm bg-transparent dark:border-gray-700 px-4">
        <div class="flex justify-between pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div class="text-lg font-medium">
                Settings
            </div>
            <div on:click={onToggle} on:keyup class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:opacity-60">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        <div class="mt-5 pb-5 border-b dark:border-zinc-700">
            <div class="flex justify-start gap-2 text-md font-medium mb-2">
                Slippage tolerance
                <TooltipIcon text={`
                    Your transaction will revert if the price changes unfavorably by more than this percentage.
                    <br><br>
                    Suggested Values:<br>
                    - Mainstream Asset Pairs: 0.5%<br>
                    - Stablecoin Pairs: 0.01%<br>
                    - Others: 3% <span class="opacity-70 text-xs">(be careful when setting a high slippage tolerance)</span>
                `}/>
            </div>
            <div class="flex justify-start items-center gap-2">
                <Tooltip content="<div class='bg-zinc-600 w-fit py-1 px-2 rounded-md mb-1 text-xs'>{$autoSlippage?'ACTIVE':'NOT ACTIVE'}</div>Automatically set the slippage tolerance to the lowest possible value for the transaction to succeed.">
                    <Button
                        label={'Auto'}
                        additionalClassList={'py-3 px-3'}
                        theme={$autoSlippage ? 'primary' : 'tertiary'}
                        on:click={() => {
                            autoSlippage.set(!$autoSlippage);
                            slippageInput.value = '';
                        }}
                    />
                </Tooltip>
                <Input
                    bind:input={slippageInput}
                    bind:value={slippage}
                    type='number'
                    placeholder={'0.1'}
                    on:input={() => {
                        if($autoSlippage) autoSlippage.set(false);
                    }}
                />
                %
            </div>
        </div>
        <div class="my-5">
            <div class="flex justify-start gap-2 text-md font-medium mb-2">
                Transaction deadline
                <TooltipIcon text={`
                    Your transaction will revert if it is pending for more than this long.<br>
                    <span class='font-light opacity-70'>Please note that a long period may lead to your trade executing at a subpar price, as the market price may change during that time.</span>
                `}/>
            </div>
            <div class="flex justify-start items-center gap-2">
                <Input bind:input={deadlineInput} bind:value={deadline} type='number' placeholder={'20'} additionalClasses='w-20'/> minutes
            </div>
        </div>
    </div>
</FullScreenContainer>