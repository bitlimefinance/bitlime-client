<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
import { readLocalStorage } from "$lib/core/utils/localStorage";
    import { _WALLETS } from "$lib/globals";
	import { accounts, connected } from "$lib/stores/application";
	import { onMount } from "svelte";
	import CreateWallet from "../createWallet.svelte";
	import ImportWallet from "../importWallet.svelte";
	import UnlockWallet from "../unlockWallet.svelte";

    let mounted: boolean = false;
    let accessToken: string;
    let slt: string;

    let view: "create" | "import" = "create";

    onMount(() => {
        accessToken = readLocalStorage("blw-pk") || "";
        slt = readLocalStorage("bl-slt") || "";
        mounted = true;
    });
</script>


<div id="blw-connect">
    {#if mounted && $accounts.length <= 0}
        <div class="w-full rounded-xl bg-zinc-800/[0.5] p-3" style="min-width: 300px;">
            {#if accessToken && slt}
                <UnlockWallet/>
            {:else if !accessToken}
                {#if view === "create"}
                    <CreateWallet/>
                    <div class="w-full flex justify-center items-center mt-4 py-2 border-t">
                        <Button
                            label="Import wallet instead"
                            on:click={() => view = "import"}
                            classList="text-sm text-center opacity-60 hover:opacity-90"
                        />
                    </div>
                {:else if view === "import"}
                    <ImportWallet/>
                    <div class="w-full flex justify-center items-center mt-4 py-2 border-t">
                        <Button
                            label="Create wallet instead"
                            on:click={() => view = "create"}
                            classList="text-sm text-center opacity-60 hover:opacity-90"
                        />
                    </div>
                {/if}
            {/if}
        </div>
    {/if}
</div>