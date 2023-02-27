<script lang="ts">
    export let bgColor: string = 'bg-green-500';
    export let textColor: string = 'text-green-400';
    export let value: boolean = false;
    export let showIcon: boolean = false;
    export let label: string = '';
    export let inline: boolean = true;
    export let invertLabelPosition: boolean = false;
    export let fullWidth: boolean = false;
    export let noBg: boolean = true;
</script>

<div class="flex {inline?"justify-start items-center":"flex-col"} gap-2 {fullWidth?"w-full":"w-fit"} disabled:opacity-50 {noBg?"":"border border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 py-1.5 px-2.5 rounded-lg"} text-sm">
    {#if label && !invertLabelPosition}
        <p class="text-zinc-900 dark:text-white font-medium text-sm">
            {label}
        </p>
    {/if}
    <!-- Enabled: "{bgColor}", Not Enabled: "bg-zinc-200" -->
    <button on:click={()=>{value=!value}} type="button" class="{value?bgColor:"bg-zinc-200 dark:bg-zinc-500"} my-auto relative m-0 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out" role="switch" aria-checked={value?"true":"false"}>
        <span class="sr-only">Use setting</span>
        <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
        <span class="{value?"translate-x-5":"translate-x-0"} pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
        <!-- Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" -->
        <span class="{value?"opacity-0 ease-out duration-100":"opacity-100 ease-in duration-200"} absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
            {#if showIcon}
                <svg class="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 12 12">
                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            {/if}
        </span>
        <!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" -->
        <span class="{value?"opacity-100 ease-in duration-200":"opacity-0 ease-out duration-100"} absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
            {#if showIcon}
                <svg class="h-3 w-3 {textColor}" fill="currentColor" viewBox="0 0 12 12">
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
            {/if}
        </span>
        </span>
    </button>
    {#if label && invertLabelPosition}
        <p class="text-zinc-900 dark:text-white font-medium text-sm">
            {label}
        </p>
    {/if}
  </div>
  