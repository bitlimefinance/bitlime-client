

<script lang="ts">
	import { randomString } from "$lib/core/utils/utilities";
	import Icon from "./icon.svelte";

    export let id = 'checkbox-'+randomString(8);
    export let checked = false;
    export let label = '';

    const toggle = () => {
        checked = !checked;
    }

</script>

<div id="container-{id}" class="flex items-start mb-4">
    <div on:click={toggle} on:keyup id={id} class="w-fit h-fit cursor-pointer border-zinc-300 rounded dark:border-zinc-600 {checked?"bg-green-500":"bg-zinc-100 dark:bg-zinc-700"}">
        <Icon icon="check" classList="w-4 h-4 text-white {checked?"":"opacity-0"}" />
    </div>
    <div id="label-{id}" class="ml-2 text-sm text-zinc-900 dark:text-zinc-300">{@html label}</div>
</div>