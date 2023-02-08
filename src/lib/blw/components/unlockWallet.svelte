<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
    import Input from "$lib/components/general/input.svelte";
	import Toast from "$lib/components/general/toast.svelte";
	import type { ToastActions } from "$lib/core/descriptors/interfaces";
	import { debug, debugError } from "$lib/core/utils/debug";
	import { deleteLocalStorage, readLocalStorage, readSessionStorage } from "$lib/core/utils/localStorage";
	import { showLoading } from "$lib/stores/ui-theming";
	import { Action, type FromWorkerMessage } from "../lib/worker/types";
	import { loadWorker, workerListener, workerPostMessage } from "../lib/worker/workerApi";
	import { toHash } from "$lib/core/utils/cipher/crypto";
	import { onMount } from "svelte";
	import { workerLoaded } from "../lib/stores";
	import { accounts, connected, selectedNetwork } from "$lib/stores/application";
	import { _WALLETS } from "$lib/globals";
	import FullScreenContainer from "$lib/components/general/fullScreenContainer.svelte";
	import { deriveAccessTokenFromPartial, getEncPartialAccessToken } from "../lib/utils";
	import { decryptCipherText } from "$lib/core/utils/cipher/passworder";

    let password: string;

    let toastActions: ToastActions;
    let showRemoveWalletPopup: boolean = false;

    onMount(async () => {
        if(!$workerLoaded) await loadWorker();
        workerListener( async (e: MessageEvent) => {
            try {
                if(!e?.data) throw new Error("Invalid message from worker.");
                const { action, payload } = e?.data as FromWorkerMessage;
                if(!action || !payload) throw new Error("Invalid message from worker.");
                switch (action) {
                    case Action.UNLOCK:{
                            connected.set(_WALLETS.BITLIME);
                            accounts.set([payload?.address]);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            } catch (error) {
                debugError(error);
            }
            
        });
    });
   
</script>



<section id="blw-unlock-wallet" class="w-full">
    <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Unlock Wallet</h1>
    
    <div class="space-y-3">
        <Input
            label="Password"
            type="password"
            id="blw-password"
            bind:value={password}
        />
        <div class="flex justify-start items-center gap-3">
            <Button
                label="Unlock"
                disabled={!password}
                on:click={async () => {
                    try {
                        showLoading.set(true);
                        const partialAccessToken = await decryptCipherText(JSON.parse(await getEncPartialAccessToken()), password);
                        const accessToken = await deriveAccessTokenFromPartial(password, partialAccessToken);
                        if(!accessToken || !partialAccessToken) throw new Error("Sorry, something went wrong.");
                        const suid = readSessionStorage('session_id') || ''; // session_id
                        workerPostMessage({
                            action: Action.UNLOCK,
                            payload: {
                                password,
                                accessToken,
                                suid,
                                network: $selectedNetwork
                            }
                        });
                        showLoading.set(false);
                    } catch (error) {
                        debugError(error);
                        showLoading.set(false);
                        window.alert("Sorry, something went wrong. Please try again.");
                    }
                }}
            />
            <Button
                label="Remove wallet"
                theme="secondary"
                on:click={() => {
                    showRemoveWalletPopup = true;
                }}
            />
        </div>
    </div>
</section>

<FullScreenContainer
    bind:show={showRemoveWalletPopup}
    id="blw-remove-wallet-popup"
    >
    <!-- are you sure confirmation -->
    <div class="flex flex-col justify-center items-center gap-3 max-w-md">
        <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Are you sure?</h1>
        <p class="text-zinc-100 text-center">This will remove your wallet from this browser. You will need to import your wallet again to use Bitlime.</p>
        <div class="flex justify-center items-center gap-3 mt-2">
            <Button
                label="Yes, remove wallet"
                on:click={() => {
                    deleteLocalStorage("blw-pk");
                    location.reload();
                }}
            />
            <Button
                label="No, keep wallet"
                theme="secondary"
                on:click={() => {
                    showRemoveWalletPopup = false;
                }}
            />
        </div>
    </div>
</FullScreenContainer>

<Toast bind:actions={toastActions}/>