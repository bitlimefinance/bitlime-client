<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
    import Input from "$lib/components/general/input.svelte";
	import Toast from "$lib/components/general/toast.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import type { ToastActions } from "$lib/core/descriptors/interfaces";
	import { debug, debugError } from "$lib/core/utils/debug";
	import { readSessionStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
	import checkPasswordStrength, { PasswordStrengthLevels, type PasswordStrength } from "$lib/core/utils/passwordStrength";
	import { showLoading } from "$lib/stores/ui-theming";
	import createWallet from "../lib/createWallet";
	import { Action, type FromWorkerMessage } from "../lib/worker/types";
	import { loadWorker, workerListener, workerPostMessage } from "../lib/worker/workerApi";
	import { onMount } from "svelte";
	import { workerLoaded } from "../lib/stores";
	import { accounts, connected } from "$lib/stores/application";
	import { _WALLETS } from "$lib/globals";
	import { createAccessTokenPair } from "../lib/utils";

    let secretPhrase: string;
    let password: string;
    let confirmPassword: string;
    let passwordStrength: PasswordStrength;
    let passworMatch: boolean = false;

    let toastActions: ToastActions;

    const checkPassword = async () => {
        if(password) passwordStrength = await checkPasswordStrength(password);
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                passworMatch = false;
            } else {
                passworMatch = true;
            }
        } else {
            passworMatch = false;
        }
    }

    $: password, confirmPassword, checkPassword(); 

    onMount(async () => {
        if(!$workerLoaded) await loadWorker();
        workerListener(async (e: MessageEvent) => {
            try{
                if(!e.data) throw new Error("Invalid message from worker.");
                const data: FromWorkerMessage = e.data;
                const { action, error, payload } = data;
                if(!action || !payload) throw new Error("Invalid message from worker.");
                switch (action) {
                    case Action.IMPORT:
                        if(error) {
                            throw new Error('Error importing wallet.');
                        } else {
                            const vault = payload?.vault;
                            const { partialAccessToken, accessToken } = await createAccessTokenPair(password, payload?.publicKey);
                            if(!accessToken || !partialAccessToken || !vault) throw new Error("Sorry, something went wrong. Please try again.");
                            console.log("Access Token: ", accessToken);
                            console.log("Partial Access Token: ", partialAccessToken);
                            
                            
                            await createWallet(vault.stringified, accessToken);
                            writeLocalStorage('blw-pk', partialAccessToken);
                            connected.set(_WALLETS.BITLIME);
                            accounts.set([payload?.address]);
                        }
                        break;
                }
            } catch (error) {
                debugError(error);
            } finally {
                showLoading.set(false);
            }
        });
    });
</script>



<section id="blw-import-wallet" class="w-full">
    <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Import Wallet</h1>
    
    <div class="space-y-3">
        <Input
            label="Secret Phrase"
            type="password"
            id="blw-secret-phrase"
            bind:value={secretPhrase}
        />
        <Input
            label="New Password"
            type="password"
            id="blw-password"
            bind:value={password}
        />
        <!-- password strength -->
        {#if password}
            <div class="flex justify-between items-center text-sm mb-2 pb-2 border-b">
                <Tooltip content="Must be at least <span class='font-semibold'>'Good'</span>, but we strongly recommend <span class='font-semibold'>'Very Strong'</span>" title="Password Strength">
                    <div class="flex justify-start gap-2 cursor-default">
                        <span class="opacity-70">Strength:</span>
                        {#if passwordStrength===PasswordStrengthLevels.Short}
                            <span class="text-red-400">Too {PasswordStrengthLevels.Short.toLowerCase()}</span>
                        {:else if passwordStrength===PasswordStrengthLevels.Common}
                            <span class="text-yellow-400">Too {PasswordStrengthLevels.Common.toLowerCase()}</span>
                        {:else if passwordStrength===PasswordStrengthLevels.Weak}
                            <span class="text-yellow-400">Too {PasswordStrengthLevels.Weak.toLowerCase()}</span>
                        {:else if passwordStrength===PasswordStrengthLevels.Good}
                            <span class="text-green-400">{PasswordStrengthLevels.Good}</span>
                        {:else if passwordStrength===PasswordStrengthLevels.Strong}
                            <span class="text-green-400">{PasswordStrengthLevels.Strong}</span>
                        {:else if passwordStrength===PasswordStrengthLevels.VeryStrong}
                            <span class="text-green-400">{PasswordStrengthLevels.VeryStrong}</span>
                        {/if}
                    </div>
                </Tooltip>
            </div>
        {/if}

        <Input
            label="Confirm Password"
            type="password"
            id="blw-confirm-password"
            bind:value={confirmPassword}
        />
        <Button
            label="Import Wallet"
            disabled={!passworMatch || !secretPhrase || !passwordStrength || (passwordStrength<PasswordStrengthLevels.Good)}
            on:click={async () => {
                try {
                    showLoading.set(true);
                    const suid = readSessionStorage('session_id') || ''; // session_id
                    if(!suid) throw new Error("Invalid session id.");
                    workerPostMessage({
                        action: Action.IMPORT,
                        payload: {
                            password,
                            secretPhrase,
                            suid
                        }
                    });
                } catch (error) {
                    debugError(error);
                    showLoading.set(false);
                    window.alert("Sorry, something went wrong. Please try again.");
                }
            }}
        />
    </div>
</section>

<Toast bind:actions={toastActions}/>