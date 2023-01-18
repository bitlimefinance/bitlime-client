<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import ErrorBox from "$lib/components/general/errorBox.svelte";
import Icon from "$lib/components/general/icon.svelte";
	import Input from "$lib/components/general/input.svelte";
	import TokenSelector from "$lib/components/swap/tokenSelector.svelte";
	import { balanceOf } from "$lib/core/sdk/erc20";
	import { getAddressChecksum, validateAddresses } from "$lib/core/sdk/web3/utils/addresses/lib";
	import { fromWei } from "$lib/core/sdk/web3/utils/units/lib";
	import { debug } from "$lib/core/utils/debug";
	import { formatNumber } from "$lib/core/utils/utilities";
	import { accounts, networkCoin } from "$lib/stores/application";
	import { onMount } from "svelte";

    let amount: number;
    let toAddress: string;
    let checksummedToAddress: string;
    let token: any = {};
    let balance: string = '0';

    let toIsValid: boolean = false;

    let loading: boolean = false;

    const updateBalance = async () => {
        if (token?.address && $accounts[0]) {   
            balance = fromWei(await balanceOf({address: $accounts[0], tokenAddress: token.address}), 'ether') || '0';
        }
    }

    const verifyAddress = async () => {
        if(!toAddress) return;
        loading = true;
        checksummedToAddress = await getAddressChecksum(toAddress);
        if(checksummedToAddress) toIsValid = true;
        else toIsValid = false;
        loading = false;
    }

    $: token, updateBalance();
    accounts.subscribe(updateBalance);
    $: toAddress, verifyAddress();

    onMount(() => {
        updateBalance();
    });
</script>


<div class="px-3 py-4">
    <!-- amount input card -->
    <div>
        <div class="flex justify-between">
            <div class="flex justify-start items-center gap-2">
                <div class="text-sm opacity-60">
                    Amount
                </div>
                <Button
                    label="Max"
                    classList="untheme px-2 py-0.5 text-xs border opacity-60 hover:opacity-100 rounded-full"
                    on:click={() => {
                        amount = parseFloat(balance);
                    }}
                />
            </div>
            <div class="text-sm opacity-60">
                Balance: {formatNumber(balance, 'number', 0, 5)}
            </div>
        </div>
        <div class="flex justify-between items-center mt-3">
            <Input
                id="send-amount-input"
                label="Amount"
                type="number"
                placeholder="0.00"
                classList="w-full mb-1 pr-2 bg-transparent text-3xl border-0 p-0 focus:border-0 focus:outline-0 focus:ring-0"
                labelClassList="sr-only"
                bind:value={amount}
            />
            <TokenSelector
                defaultToken={'native'}
                bind:value={token}
            />
        </div>
        {#if amount && balance && amount > parseFloat(balance)}
            <ErrorBox message="You don't have enough balance to send this amount."/>
        {/if}
    </div>
    <!-- to-address input card -->
    <div class="mt-3">
        <div class="flex justify-between">
            <div class="text-sm opacity-60">
                To
            </div>
        </div>
        <div class="mt-3">
            <Input
                id="send-to-input"
                label="Address"
                type="text"
                placeholder="Wallet address, ICAP address or ENS name"
                classList="w-full bg-transparent border-0 p-0 focus:border-0 focus:outline-0 focus:ring-0"
                labelClassList="sr-only"
                loading={loading}
                bind:value={toAddress}
            />
            {#if !toIsValid && toAddress && !loading}
                <ErrorBox message="The value you entered is not a valid address or ENS name." />
            {/if}
        </div>
    </div>
    <!-- send button -->
    <div class="mt-5">
        <Button
            label="Send"
            disabled={!toIsValid || !amount || amount > parseFloat(balance)}
            on:click={() => {
                debug('send', {amount, toAddress: checksummedToAddress, token});
            }}
        />
    </div>
</div>