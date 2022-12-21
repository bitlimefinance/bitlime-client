
<script lang="ts">
	import type { Heroicon } from "$lib/icons/icons";
    import "$lib/icons/icons.css";

    export let outline: boolean = false;
    export let icon: Heroicon = 'face-smile'; // icons from https://heroicons.com/

    $: path = '../../icons/' + (outline ? 'outline' : 'solid') + '/' + icon + '.svelte';

</script>

{#await import(path) then iconComponent}
    <svelte:component this={iconComponent.default}/>
{/await}