
<script lang="ts">
	import type { Heroicon } from "$lib/icons/icons";
    import "$lib/icons/icons.css";
	import { createEventDispatcher } from "svelte";

    export let outline: boolean = false;
    export let icon: Heroicon = 'face-smile'; // icons from https://heroicons.com/
    export let classList: string = '';
    export let size: number = 5;

    const dispatch = createEventDispatcher();

    $: path = '../../icons/' + (outline ? 'outline' : 'solid') + '/' + icon + '.svelte';

</script>

<span class={classList + 'w-'+size+' h-'+size}>
    {#await import(path) then iconComponent}
        <svelte:component this={iconComponent.default}/>
    {/await}
</span>