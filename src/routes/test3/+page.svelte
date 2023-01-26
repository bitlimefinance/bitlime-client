<script lang="ts">
	import ImportWallet from "$lib/blw/components/importWallet.svelte";
	import { mainHeight_ } from "$lib/stores/ui-theming";
    
</script>

<div class="flex justify-center items-center gap-5 p-0" style="min-height: {$mainHeight_}px;">
    <section style="max-width: 400px; min-width: 400px;">
        <ImportWallet />
    </section>
</div>
