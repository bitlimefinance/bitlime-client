
<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";
	import type { Heroicon } from "$lib/icons/icons";
    import "$lib/icons/icons.css";
	import { createEventDispatcher, onMount } from "svelte";

    export let outline: boolean = false;
    export let icon: Heroicon = 'face-smile'; // icons from https://heroicons.com/
    export let classList: string = '';
    export let size: number = 5; // size in Tailwind units
    export let id: string = randomString(5)+'-'+icon;
    export let color: string = 'inherit';

    const dispatch = createEventDispatcher();

    $: path = '../../icons/' + (outline ? 'outline' : 'solid') + '/' + icon + '.svelte';

</script>

<div id={id} class="{classList} w-{size} h-{size}" on:click={() => {dispatch('click')}} on:keyup style="color: {color}">
    {#await import(path) then iconComponent}
        <svelte:component this={iconComponent.default}/>
    {/await}
</div>