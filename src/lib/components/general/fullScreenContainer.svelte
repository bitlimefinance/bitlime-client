
<script lang="ts">
	import { getPageHeight, randomString } from "$lib/core/utils/utilities";
	import { onMount, createEventDispatcher } from "svelte";

    export let zIndex: string = '50';
    export let additionalClasses: string = '';
    export let noBg: boolean = false;
    export let noPadding: boolean = false;
    export let id: string = '';
    export let show: boolean = false;
    export let alwaysShow: boolean = false;

    if(!id) id = 'full-screen-container-'+randomString(5);

    let element: HTMLDivElement;
    let container: HTMLDivElement;
    let height: number = 0;

    export const dispatch = createEventDispatcher();
    
    const onHide = () => {
        if(container.matches(':hover')) return;
        show = false;
        dispatch('hide');
    }

    onMount(() => {
        height = getPageHeight() + 'px';
    });
</script>

{#if show || alwaysShow}
    <div on:click={onHide} on:keyup id={id} bind:this={element} class="absolute z-50 min-h-screen min-w-full bg-black bg-opacity-90 dark:bg-opacity-80  top-0 bottom-0 left-0 right-0 p-0 m-0" style="z-index: {zIndex}; min-height: {height}px;">
        <div class="fixed flex justify-center items-center min-w-full min-h-screen">
            <div id={id+"-content"} bind:this={container} class="w-fit {noPadding?'':'p-4'} rounded-lg {noBg?'bg-transparent':'bg-white dark:bg-zinc-900'} {additionalClasses}">
                <slot/>
            </div>
        </div>
    </div>
{/if}