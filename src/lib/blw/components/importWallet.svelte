<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Checkbox from "$lib/components/general/checkbox.svelte";
	import Icon from "$lib/components/general/icon.svelte";
    import Input from "$lib/components/general/input.svelte";
	import Toast from "$lib/components/general/toast.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import type { ToastActions } from "$lib/core/descriptors/interfaces";
	import { fromEncryptedJson, newWallet } from "$lib/core/sdk/web3/wallet/lib";
	import { debug, debugError } from "$lib/core/utils/debug";
	import { readLocalStorage, readSessionStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
	import { decryptCipherText, encryptMessage, type EncryptedVault } from "$lib/core/utils/cipher/passworder";
	import checkPasswordStrength, { PasswordStrengthLevels, type PasswordStrength } from "$lib/core/utils/passwordStrength";
	import { numberToOrderShort, randomInt, randomString, shuffleArray } from "$lib/core/utils/utilities";
	import { showLoading } from "$lib/stores/ui-theming";
	import { ethers } from "ethers";
	import type { Mnemonic } from "ethers/lib/utils";
	import createWallet from "../lib/createWallet";
	import unlockWallet from "../lib/unlockWallet";
	import { Action } from "../lib/worker/types";
	import { loadWorker, workerPostMessage } from "../lib/worker/workerApi";
	import { toHash } from "$lib/core/utils/cipher/crypto";

    let step: 1 | 2 | 3 = 1;

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


</script>



<div id="blw" class="w-full rounded-xl bg-zinc-800/[0.5] p-3" style="min-width: 300px;">
    <section id="blw-nav" class="w-full">
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
                        const localPk = readLocalStorage("blw-pk");
                        const pk = await toHash(localPk+password);
                        if(!pk || !localPk) throw new Error("Sorry, something went wrong.");
                        const suid = readSessionStorage('session_id') || ''; // session_id
                        await loadWorker();
                        workerPostMessage({
                            action: Action.INIT,
                            payload: {
                                password,
                                pk,
                                suid
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
        </div>
    </section>
</div>

<Toast bind:actions={toastActions}/>