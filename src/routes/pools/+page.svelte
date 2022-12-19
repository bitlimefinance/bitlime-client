<script>
	import { mainHeight_ } from "$lib/stores/ui-theming";
</script>

<svelte:head>
	<title>Pools - Bitlime</title>
</svelte:head>

<div class="p-10 my-auto w-full" style="min-height: {$mainHeight_}px;">
	<header class="py-5 mb-5 border-b border-b-zinc-500/[0.3] w-full">
        <h1 class="text-6xl font-semibold text-zinc-900 dark:text-white">Pools</h1>
    </header>
    <section>
        <ul>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
            <li>
                <div class="border-b border-b-zinc-500/[0.3] h-12 w-full">
                </div>
            </li>
        </ul>
    </section>
</div>
