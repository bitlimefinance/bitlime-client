
<script lang="ts">
	import type { Heroicon } from "$lib/icons/icons";

    export let solid: boolean = true;
    export let icon: Heroicon = 'face-smile'; // icons from https://heroicons.com/

    $: path = '../../icons/' + (solid ? 'solid' : 'outline') + '/' + icon + '.svelte';

</script>

{#await import(path) then iconComponent}
    <svelte:component this={iconComponent.default}/>
{/await}