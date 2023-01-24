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
	import { readLocalStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
	import { decryptCipherText, encryptMessage, type EncryptedVault } from "$lib/core/utils/passworder";
	import checkPasswordStrength, { PasswordStrengthLevels, type PasswordStrength } from "$lib/core/utils/passwordStrength";
	import { numberToOrderShort, randomInt, randomString, shuffleArray } from "$lib/core/utils/utilities";
	import { showLoading } from "$lib/stores/ui-theming";
	import { ethers } from "ethers";
	import type { Mnemonic } from "ethers/lib/utils";
	import createWallet from "../lib/createWallet";
	import unlockWallet from "../lib/unlockWallet";

    let step: 1 | 2 | 3 = 1;

    let password: string;

    let publicKey: string = '';
    let vault: any;

    let toastActions: ToastActions;

   
</script>



<div id="blw" class="w-full rounded-xl bg-zinc-800/[0.5] p-3" style="min-width: 300px;">
    <section id="blw-nav" class="w-full">
        <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Unlock Wallet</h1>
        
        <div class="space-y-3">
            <Input
                label="Password"
                type="password"
                id="blw-password"
                bind:value={password}
            />
            <Button
                label="Unlock"
                disabled={!password}
                on:click={async () => {
                    try {
                        showLoading.set(true);
                        let pk = readLocalStorage("blw-pk");
                        if(!pk) throw new Error("No private key found");
                        let encVault = JSON.parse(await unlockWallet(pk));
                        vault = await decryptCipherText(encVault, password);
                        const wallet = await fromEncryptedJson(vault, password);
                        debug("Wallet", wallet);
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