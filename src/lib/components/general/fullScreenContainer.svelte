
<script lang="ts">
	import { getPageHeight } from "$lib/core/utils/utilities";
	import { onMount } from "svelte";

    export let zIndex: string = '50';
    export let additionalClasses: string = '';
    export let noBg: boolean = false;
    export let noPadding: boolean = false;

    let element: HTMLDivElement;

    onMount(() => {
        element.style.height = getPageHeight() + 'px';
    });
</script>

<div bind:this={element} class="absolute z-50 min-h-screen min-w-full bg-black bg-opacity-90 dark:bg-opacity-80  top-0 bottom-0 left-0 right-0 p-0 m-0" style="z-index: {zIndex};">
    <div class="fixed flex justify-center items-center min-w-full min-h-screen">
        <div class="min-fit {noPadding?'':'p-4'} rounded-lg {noBg?'bg-transparent':'bg-white dark:bg-zinc-900'} {additionalClasses}">
            <slot/>
        </div>
    </div>
</div>