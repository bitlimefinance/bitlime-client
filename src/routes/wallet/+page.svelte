<script lang="ts">

    import Connect from "$lib/blw/components/walletSections/connect.svelte";
    import Wallet from "$lib/blw/wallet.svelte";
	import { _WALLETS } from "$lib/globals";
	import { accounts, connected } from "$lib/stores/application";
	import { mainHeight_ } from "$lib/stores/ui-theming";
	import { onMount } from "svelte";

    let walletHeight: number = 0;

    onMount(()=>{
        if($connected && $connected !== _WALLETS.BITLIME) {
            accounts.set([]);
            if($connected !== _WALLETS.DISCONNECTED) location.reload();
        }
    })
</script>

<div class="flex justify-center items-center gap-5 px-0 py-5" style="min-height: {$mainHeight_}px;">
    <section style="max-width: 400px; min-width: 400px;" bind:clientHeight={walletHeight}>
        {#if $accounts.length > 0 && $connected == _WALLETS.BITLIME}
            <Wallet />
        {:else}
            <Connect />
        {/if}
    </section>
    <!-- {#if $accounts.length > 0}
        <section class="w-full rounded-xl bg-zinc-800/[0.5] overflow-y-auto" style="height: {walletHeight}px;">
        </section>
    {/if} -->
</div>