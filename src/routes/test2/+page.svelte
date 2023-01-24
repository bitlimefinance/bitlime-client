<script lang="ts">
	import UnlockWallet from "$lib/blw/components/unlockWallet.svelte";
	import { mainHeight_ } from "$lib/stores/ui-theming";
    
</script>

<div class="flex justify-center items-center gap-5 p-0" style="min-height: {$mainHeight_}px;">
    <section style="max-width: 400px; min-width: 400px;">
        <UnlockWallet />
    </section>
</div>
