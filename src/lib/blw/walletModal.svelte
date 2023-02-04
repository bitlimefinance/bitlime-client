<script lang="ts">
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import { _WALLETS } from "$lib/globals";
	import { connected, showConnenct } from "$lib/stores/application";
	import Connect from "./components/walletSections/connect.svelte";
	import { showBlw } from "./lib/stores";

    let showModal: boolean = false;

    showBlw.subscribe((value) => {
        if(value === showModal) return;
        if(value) showConnenct.set(false);
        showModal = value;
    });
    $: showModal, showBlw.set(showModal);

    connected.subscribe((value) => {
        if(value===_WALLETS.BITLIME) showBlw.set(false);
    });
</script>


<FullScreenContainer noPadding bind:show={showModal}>
    <div class="max-w-sm">
        <Connect />
    </div>
</FullScreenContainer>