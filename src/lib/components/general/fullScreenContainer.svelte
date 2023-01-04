
<script lang="ts">
	import { getPageHeight, randomString } from "$lib/core/utils/utilities";
	import { onMount, createEventDispatcher } from "svelte";

    export let zIndex: string = '100';
    export let additionalClasses: string = '';
    export let noBg: boolean = false;
    export let noPadding: boolean = false;
    export let id: string = '';
    export let show: boolean = false;
    export let alwaysShow: boolean = false;
    export let noBackDrop: boolean = false;

    if(!id) id = 'full-screen-container-'+randomString(5);

    let element: HTMLDivElement;
    let container: HTMLDivElement;

    export const dispatch = createEventDispatcher();
    
    const onHide = () => {
        if(container.matches(':hover')) return;
        show = false;
        dispatch('hide');
    }
</script>

{#if show || alwaysShow}
    <div on:click={onHide} on:keyup id={id} bind:this={element} class="p-0 m-0"
        style="
            z-index: {zIndex};
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        ">
        <div class="fixed flex justify-center items-center min-w-full min-h-screen {noBackDrop?'bg-transparent':'bg-white dark:bg-black'} bg-opacity-90 dark:bg-opacity-80">
            <div id={id+"-content"} bind:this={container} class="w-fit {noPadding?'':'p-4'} rounded-lg {noBg?'bg-transparent':'bg-white dark:bg-zinc-900'} {additionalClasses}">
                <slot/>
            </div>
        </div>
    </div>
{/if}