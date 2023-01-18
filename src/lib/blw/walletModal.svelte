<script lang="ts">
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import { showBlw } from "$lib/globals";
	import { showConnenct } from "$lib/stores/application";
	import Wallet from "./wallet.svelte";

    let showModal: boolean = false;

    showBlw.subscribe((value) => {
        if(value === showModal) return;
        if(value) showConnenct.set(false);
        showModal = value;
    });
    $: showModal, showBlw.set(showModal);
</script>


<FullScreenContainer noPadding bind:show={showModal}>
    <Wallet />
</FullScreenContainer>