<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
    import Input from "$lib/components/general/input.svelte";

    let step: 1 | 2 | 3 = 1;

</script>



<div id="blw" class="w-full rounded-xl bg-zinc-800/[0.5] p-3" style="min-width: 300px;">
    <section id="blw-nav" class="w-full">
        <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Create Wallet</h1>
        
        <!-- progress bar -->
        <div class="untheme flex justify-center items-center gap-2 mb-3">
            <div class="untheme w-full border-b {step===1?"border-green-400":""}"/>
            <span class="{step==1?"text-green-400":""}">1</span>
            <div class="untheme w-full border-b {step===2?"border-green-400":""}"/>
            <span class="{step==2?"text-green-400":""}">2</span>
            <div class="untheme w-full border-b {step===3?"border-green-400":""}"/>
            <span class="{step===3?"text-green-400":""}">3</span>
            <div class="untheme w-full border-b {step===3?"border-green-400":""}"/>
        </div>
        

        {#if step===1}
        <div class="space-y-3">
            <Input
                label="Password"
                type="password"
                id="blw-password"
            />
            <Input
                label="Confirm Password"
                type="password"
                id="blw-confirm-password"
            />
            <Button
                label="Create"
                on:click={() => {
                    console.log('create wallet');
                }}
            />
        </div>
        {:else if step===2}
        <div></div>
        {/if}
    </section>
</div>