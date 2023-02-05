

<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import Icon from "$lib/components/general/icon.svelte";
	import { getAddressPreview } from "$lib/core/sdk/web3/utils/addresses/lib";
	import { ADDRESS_0 } from "$lib/core/sdk/web3/utils/constants/lib";
	import { camelToTitleCase } from "$lib/core/utils/utilities";
	import { _themes } from "$lib/globals";
	import { accounts } from "$lib/stores/application";
	import { theme } from "$lib/stores/ui-theming";
	import { txConfirmation, txInfo } from "../lib/stores";

    let id = "blw-tx-confirmation";
    let show: boolean = true;

    // txConfirmation.subscribe((value) => {
    //     if(show === value) return;
    //     show = value;
    // });

    // $: show, txConfirmation.set(show);

</script>

<FullScreenContainer
    bind:show={show}
    alwaysShow
    id={id}
    >
    <div id="{id}-container" class="w-full" style="min-width: 300px; max-width: 500px;">
        <section id="{id}-nav" class="w-full flex justify-between items-center pb-3.5 pt-2 border-b">
            <div id="{id}-nav-left">
                <img src="/assets/bl-logos/{$theme==_themes.dark?'logo-bold.png':'logo-bold.png'}" alt="logo" class="h-7" />
                <span class="font-medium dark:font-normal text-xl dark:text-emerald-500 sr-only">BitLime</span>
            </div>
            <div id="{id}-nav-right">
                <Icon icon="x-mark" classList="cursor-pointer" on:click={() => txConfirmation.set(false)} />
            </div>
        </section>
        <section class="w-full">
            <div class="py-1 px-2 border rounded-md mt-3 text-sm">
                <div class="opacity-60">
                    {window?.location?.origin}
                </div>
                {camelToTitleCase('swapExactTokensForTokens')}
            </div>
            <div class="flex justify-center items-center gap-3 mt-3 w-full">
                <div class="py-1 px-2 border rounded-md">
                    <div class="text-xs opacity-70">
                        From:
                    </div>
                    <div>
                        {getAddressPreview($txInfo?.from || $accounts[0] || ADDRESS_0)}
                    </div>
                </div>
                <div>
                    <Icon icon="arrow-right" />
                </div>
                <div class="py-1 px-2 border rounded-md w-full">
                    <div class="text-xs opacity-70">
                        To:
                    </div>
                    <div>
                        {getAddressPreview($txInfo?.to || ADDRESS_0)}
                    </div>
                </div>
            </div>
        </section>
    </div>
</FullScreenContainer>
