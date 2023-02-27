<script>
	import NewPool from "$lib/components/pools/newPool.svelte";
	import { mainHeight_ } from "$lib/stores/ui-theming";
    
</script>

<div
    class="flex justify-center items-center w-full"
    style="height: {$mainHeight_}px"
    >
    <NewPool/>
</div>