

<script lang="ts">
	import type { ToastActions } from "$lib/core/descriptors/interfaces";
	import { randomString } from "$lib/core/utils/utilities";
	import type { Heroicon } from "$lib/icons/icons";
	import { onMount } from "svelte";
	import Icon from "./icon.svelte";

    export let id: string = 'toast-'+randomString(8);
    export let additionalHTML: string = '';
    export let dismissable: boolean = true;
    let timeout: number = 3000;
    let icon: Heroicon = 'information-circle';
    let iconOutline: boolean = false;
    let positionY: 'top' | 'bottom' = 'bottom';
    let positionX: 'left' | 'right' = 'right';

    let message: string = '';
    let toast: HTMLDivElement;
    let timeoutID: number = 0;

    let accentColor: string = 'bg-blue-100 dark:bg-blue-800';

    const dismiss = () => {
        if(toast&&dismissable) toast.classList.add('hidden');
    }

    const startTimeout = () => {
        if(dismissable) timeoutID = window.setTimeout(dismiss, timeout);
    }
    
    const stopTimeout = () => {
        window.clearTimeout(timeoutID);
    }

    const show = (msg: string, options?:{
        type?: 'info' | 'success' | 'warning' | 'error';
        icon?: Heroicon;
        iconOutline?: boolean;
        timeout?: number;
        positionY?: 'top' | 'bottom';
        positionX?: 'left' | 'right';
    }) => {
        if(!toast) return;
        message = msg;
        icon = options?.icon || 'information-circle';
        iconOutline = options?.iconOutline || false;
        timeout = options?.timeout || 3000;
        positionY = options?.positionY || 'bottom';
        positionX = options?.positionX || 'right';

        let type = options?.type || 'info';
        switch(type) {
            case 'info':
                accentColor = 'bg-blue-100 dark:bg-blue-800';
                break;
            case 'success':
                accentColor = 'bg-green-100 dark:bg-green-800';
                break;
            case 'warning':
                accentColor = 'bg-yellow-100 dark:bg-yellow-800';
                break;
            case 'error':
                accentColor = 'bg-red-100 dark:bg-red-800';
                break;
            default:
                accentColor = 'bg-blue-100 dark:bg-blue-800';
                break;
        }
        toast.classList.remove('hidden');
        startTimeout();
    }

    export const actions: ToastActions = {
        show: show,
        dismiss: dismiss,
        stopTimeout: stopTimeout,
        startTimeout: startTimeout
    }
    
    onMount(() => {
        // move the container to the end of the body
        document.body.appendChild(toast);
    });
</script>




<div
    bind:this={toast}
    id={id}
    class="absolute hidden w-full h-fit max-w-xs p-3 text-zinc-500 bg-white rounded-lg dark:text-zinc-400 dark:bg-zinc-800"
    role="alert"
    style={`
        position: absolute;
        ${positionY}: 15px;
        ${positionX}: 15px;
    `}
    >
    <div class="flex items-center w-full h-full">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg {accentColor}">
            <Icon icon={icon} outline={iconOutline}/>
            <span class="sr-only">{icon + ' icon'}</span>
        </div>
        <div class="ml-3 text-sm font-normal">{message}</div>
        {#if additionalHTML}
            {@html additionalHTML}
        {/if}
        <button
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-zinc-400 hover:text-zinc-900 rounded-lg focus:ring-2 focus:ring-zinc-300 p-1.5 hover:bg-zinc-100 inline-flex h-8 w-8 dark:text-zinc-500 dark:hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700"
            aria-label="Close"
            on:click={dismiss}
            >
            <span class="sr-only">Close</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
    </div>
</div>
