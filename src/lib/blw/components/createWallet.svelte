<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Icon from "$lib/components/general/icon.svelte";
    import Input from "$lib/components/general/input.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import { debug, debugError } from "$lib/core/utils/debug";
	import { decryptCipherText, encryptMessage, type EncryptedVault } from "$lib/core/utils/passworder";
	import checkPasswordStrength, { PasswordStrengthLevels, type PasswordStrength } from "$lib/core/utils/passwordStrength";

    let step: 1 | 2 | 3 = 1;

    let password: string;
    let confirmPassword: string;
    let passworMatch: boolean;
    let passwordStrength: PasswordStrength;

    const checkPassword = async () => {
        if(password) passwordStrength = await checkPasswordStrength(password);
        if (password && confirmPassword) {
            console.log(passwordStrength);
            
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
        
        <!-- steps -->
        {#if step===1}
        <div class="space-y-3">
            <div class="text-sm opacity-70">
                This password will be used to secure your wallet, so make sure it's strong and keep it safe.
            </div>
            <Input
                label="Password"
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
                    <!-- {#if passwordStrength===PasswordStrengthLevels.VeryStrong || passwordStrength===PasswordStrengthLevels.Strong || passwordStrength===PasswordStrengthLevels.Good}
                        <Icon icon="check" color="rgb(49, 196, 141)"/>
                    {:else}
                        <Icon icon="x-mark" color="red"/>
                    {/if} -->
                </div>
            {/if}

            <Input
                label="Confirm Password"
                type="password"
                id="blw-confirm-password"
                bind:value={confirmPassword}
            />
            <Button
                label="Create"
                disabled={!passworMatch}
                on:click={async () => {
                    try {
                        let vault = await encryptMessage('test', password);
                        debug(await checkPasswordStrength(password))
                        debug(vault);
                        debug(await decryptCipherText(vault, password));
                        step = 2;
                    } catch (error) {
                        debugError(error);
                        window.alert("Sorry, something went wrong. Please try again.");
                    }

                }}
            />
        </div>
        {:else if step===2}
        <div></div>
        {/if}
    </section>
</div>