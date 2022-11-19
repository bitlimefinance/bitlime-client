<script lang="ts">
	import { getAddressPreview } from "$lib/core/web3Manager";
	import { _WALLETS } from "$lib/globals";
  import { connectMetamask } from "$lib/metamask/core";
	import { accounts, connected } from "$lib/stores/application";
	import Button from "./general/button.svelte";
	import ThemeToggle from "./themeToggle.svelte";
</script>

<nav class="navbar bg-transparent pr-5">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-green-500 normal-case text-lg">
            <img src="/favicon.png" alt="logo" class="h-6 mr-2" />
            BitLime
        </a>
    </div>
    <div class="flex-none gap-2">
      <div>
        <ThemeToggle/>
      </div>
      {#if $connected!=_WALLETS.DISCONNECTED}
        <Button
          label={getAddressPreview($accounts[0])}
          classList="bg-primary text-slate-800 font-medium text-sm rounded-full px-4 py-2"
          on:click={connectMetamask}
          />
      {:else}
        <Button
          label="Connect"
          classList="bg-primary text-slate-800 font-medium text-sm rounded-full px-4 py-2"
          on:click={connectMetamask}
          />
      {/if}
    </div>
</nav>