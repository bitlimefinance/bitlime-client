

<script lang="ts">
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import { txConfirmation } from "../lib/stores";

    let show: boolean = false;

    txConfirmation.subscribe((value) => {
        if(show === value) return;
        show = value;
    });

    $: show, txConfirmation.set(show);

</script>

<FullScreenContainer
    bind:show={show}
    >
    
</FullScreenContainer>
