<script lang="ts">
	import { getAddressPreview } from "$lib/core/web3Manager";
	import { _WALLETS, _WALLETS_INFO } from "$lib/globals";
	import { accounts, connected, showConnenct } from "$lib/stores/application";
	import Button from "./general/button.svelte";
	import ThemeToggle from "./themeToggle.svelte";
</script>

<nav class="flex justify-between items-center bg-transparent px-5 py-4">
    <div>
        <a href="/" class="flex justify-start items-center btn btn-ghost text-green-500 normal-case text-lg">
            <img src="/favicon.png" alt="logo" class="h-6 mr-2" />
            BitLime
        </a>
    </div>
    <div class="flex justify-end items-center gap-2">
      <ThemeToggle/>
      {#if $connected&&$connected!=_WALLETS.DISCONNECTED}
        <Button
          label={getAddressPreview($accounts[0])}
          additionalClassList="rounded-full px-4 py-2"
          on:click={()=>{}}
          />
      {:else}
        <Button
          label="Connect"
          additionalClassList="rounded-full px-4 py-2"
          on:click={()=>{showConnenct.set(true)}}
          />
      {/if}
    </div>
</nav>
