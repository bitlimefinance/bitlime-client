
<script lang="ts">
	import { getPageHeight } from "$lib/core/utils/utilities";
	import { onMount } from "svelte";

    let element: HTMLDivElement;

    onMount(() => {
        element.style.height = getPageHeight() + 'px';
    });
</script>

<div bind:this={element} class="absolute z-50 min-h-screen min-w-full bg-black bg-opacity-90 dark:bg-opacity-80  top-0 bottom-0 left-0 right-0 p-0 m-0">
    <div class="fixed flex justify-center items-center min-w-full min-h-screen">
        <slot/>
    </div>
</div>