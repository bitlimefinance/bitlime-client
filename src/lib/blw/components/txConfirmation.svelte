

<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import Icon from "$lib/components/general/icon.svelte";
	import Input from "$lib/components/general/input.svelte";
	import Toggle from "$lib/components/general/toggle.svelte";
	import { getAddressPreview } from "$lib/core/sdk/web3/utils/addresses/lib";
	import { fromBigNumber } from "$lib/core/sdk/web3/utils/bigNumber/lib";
	import { ADDRESS_0 } from "$lib/core/sdk/web3/utils/constants/lib";
	import { fromWei } from "$lib/core/sdk/web3/utils/units/lib";
	import { debug, debugError } from "$lib/core/utils/debug";
	import { camelToTitleCase, formatNumber } from "$lib/core/utils/utilities";
	import { _themes } from "$lib/globals";
	import { accounts, selectedNetwork } from "$lib/stores/application";
	import { showLoading, theme } from "$lib/stores/ui-theming";
	import type { BigNumber } from "ethers";
	import { onMount } from "svelte";
	import { txConfirmation, txInfo } from "../lib/stores";

    let id = "blw-tx-confirmation";
    let show: boolean;
    let origin: string;
    let advanced: boolean = false;

    let amount: number, gas: number;

    $: total = amount + gas;

    // txConfirmation.subscribe((value) => {
    //     if(show === value) return;
    //     show = value;
    // });

    // $: show, txConfirmation.set(show);


    onMount(() => origin = window?.location?.origin);

    txConfirmation.subscribe((value) => {
        if(show === value) return;
        show = value;
    });

    txInfo.subscribe((obj) => {
        if(!obj) return;
        const { value, estimatedGas } = obj;
        amount = parseFloat(value || "0");
        gas = parseFloat(estimatedGas || "0");
    });

</script>

<FullScreenContainer
    bind:show={show}
    id={id}
    >
    <div id="{id}-container" class="w-full" style="min-width: 300px; max-width: 500px;">
        <section id="{id}-nav" class="w-full flex justify-between items-center mb-3 pb-3.5 pt-2 border-b">
            <div id="{id}-nav-left">
                <img src="/assets/bl-logos/{$theme==_themes.dark?'logo-bold.png':'logo-bold.png'}" alt="logo" class="h-7" />
                <span class="font-medium dark:font-normal text-xl dark:text-emerald-500 sr-only">BitLime</span>
            </div>
            <div id="{id}-nav-right">
                <Icon icon="x-mark" classList="cursor-pointer" on:click={() => txConfirmation.set(false)} />
            </div>
        </section>
        <section class="w-full">
            <Toggle
                label="Advanced"
                bind:value={advanced}
                />
            <div class="mt-3 pt-3 border-t text-sm">
                <div class="opacity-60">
                    {origin}
                </div>
                {camelToTitleCase($txInfo?.methodName || 'Unknown Method').toUpperCase()}
            </div>
            {#if advanced}
            <div class="flex justify-center items-center gap-3 mt-3 pt-3 border-t w-full">
                <div class="w-full">
                    <div class="text-xs opacity-70">
                        From:
                    </div>
                    <div>
                        {getAddressPreview($txInfo?.from || $accounts[0] || ADDRESS_0)}
                    </div>
                </div>
                <div>
                    <Icon icon="arrow-right" size={4} />
                </div>
                <div class="w-full">
                    <div class="text-xs opacity-70">
                        To:
                    </div>
                    <div>
                        {getAddressPreview($txInfo?.to || ADDRESS_0)}
                    </div>
                </div>
            </div>
            {/if}
            {#if advanced}
            <div class="w-full mt-3 pt-3 border-t flex justify-between items-center">
                <div class="text-xs opacity-70">
                    AMOUNT
                </div>
                <div class="flex justify-end items-center gap-2">
                    <img src={$selectedNetwork?.logo || ''} alt="logo" class="h-4 rounded-full" />
                    <div class="text-sm opacity-80 font-light">{formatNumber(fromWei(amount || "0", 'ether') || 0, 'number', 2, 18)}</div>
                </div>
            </div>
            <div class="w-full mt-3 flex justify-between items-center">
                <div class="text-xs opacity-70">
                    GAS FEE
                </div>
                <div class="flex justify-end items-center gap-2">
                    <img src={$selectedNetwork?.logo || ''} alt="logo" class="h-4 rounded-full" />
                    <div class="text-sm opacity-80 font-light">{formatNumber(fromWei(gas || "0", 'ether') || 0, 'number', 2, 18)}</div>
                </div>
            </div>
            {/if}
            <div class="w-full mt-3 pt-3 border-t flex justify-between items-center">
                <div class="w-full">
                    <div class="flex justify-between items-start w-full">
                        <div class="text-sm opacity-70">
                            TOTAL
                        </div>
                        <div class="text-xs opacity-70">
                            Amount + Gas Fee
                        </div>
                    </div>
                    <div class="flex justify-end items-center gap-2">
                        <img src={$selectedNetwork?.logo || ''} alt="logo" class="h-4 rounded-full" />
                        <div class="text font">{formatNumber(fromWei(total || "0", 'ether') || 0, 'number', 2, 18)}</div>
                    </div>
                </div>
            </div>
            {#if advanced}
            <div class="w-full mt-3 pt-3 border-t flex justify-between items-center">
                <div class="text-xs opacity-70">
                    CUSTOM NONCE
                </div>
                <Input placeholder={"74"} additionalClasses="text-right" style="max-width: 120px;"/>
            </div>
            {/if}
            <div class="w-full mt-3 pt-3 border-t flex justify-start gap-3 items-center">
                <Button
                    label="Cancel"
                    theme="secondary"
                    on:click={() => txConfirmation.set(false)}
                    />
                <Button
                    label="Confirm"
                    on:click={() => {
                        try {
                            showLoading.set(true);
                            $txInfo?.callback?.();
                        } catch (error) {
                            debugError(error);
                        } finally {
                            txConfirmation.set(false);
                            showLoading.set(false);
                        }
                    }}
                    />
            </div>
        </section>
    </div>
</FullScreenContainer>
