<script lang="ts">

	import Wallet from "$lib/blw/wallet.svelte";
	import { mainHeight_ } from "$lib/stores/ui-theming";

    let walletHeight: number = 0;
    
</script>

<div class="flex justify-center items-center gap-5 p-0" style="min-height: {$mainHeight_}px;">
    <section style="max-width: 400px; min-width: 400px;" bind:clientHeight={walletHeight}>
        <Wallet />
    </section>
    <section class="w-full rounded-xl bg-zinc-800/[0.5]" style="height: {walletHeight}px;">
    </section>
</div>
