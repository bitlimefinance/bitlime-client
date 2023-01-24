<script lang="ts">
	import Button from "$lib/components/general/button.svelte";
	import Checkbox from "$lib/components/general/checkbox.svelte";
	import Icon from "$lib/components/general/icon.svelte";
    import Input from "$lib/components/general/input.svelte";
	import Toast from "$lib/components/general/toast.svelte";
	import Tooltip from "$lib/components/general/tooltip.svelte";
	import type { ToastActions } from "$lib/core/descriptors/interfaces";
	import { newWallet } from "$lib/core/sdk/web3/wallet/lib";
	import { debugError } from "$lib/core/utils/debug";
	import { writeLocalStorage } from "$lib/core/utils/localStorage";
	import { encryptMessage, type EncryptedVault } from "$lib/core/utils/passworder";
	import checkPasswordStrength, { PasswordStrengthLevels, type PasswordStrength } from "$lib/core/utils/passwordStrength";
	import { numberToOrderShort, randomInt, shuffleArray } from "$lib/core/utils/utilities";
	import { showLoading } from "$lib/stores/ui-theming";
	import createWallet from "../lib/createWallet";

    let step: 1 | 2 | 3 = 1;

    let password: string;
    let confirmPassword: string;
    let passworMatch: boolean;
    let passwordStrength: PasswordStrength;

    let confirmMnemonicWarning: boolean = false;
    let showMnemonic: boolean = false;
    let mnemonic: string = '';
    $: mnemonicWords = mnemonic.split(' ') || [];
    $: shuffledMnemonic = shuffleArray(mnemonic.split(' ')) || [];
    let correctWords: boolean = false;
    let selectedMnemonicWords: string[] = [];
    let mnemonicIndexesToCheck: number[] = [];
    let publicKey: string = '';
    let vault: EncryptedVault | undefined;

    let termnsAccepted: boolean = false;

    let toastActions: ToastActions;

    const generateRandomIndexes = () => {
        let indexes: number[] = [];
        for (let i = 0; i < 3; i++) {
            let index = randomInt(0, 11);
            while (indexes.includes(index)) {
                index = randomInt(0, 11);
            }
            indexes.push(index);
        }
        mnemonicIndexesToCheck = indexes;
    }
    $: mnemonicWords, generateRandomIndexes();

    const checkSelectedWords = () => {
        if (selectedMnemonicWords.length !== 3) {
            correctWords = false;
            return;
        }
        let correct = true;
        let answer = [mnemonicWords[mnemonicIndexesToCheck[0]], mnemonicWords[mnemonicIndexesToCheck[1]], mnemonicWords[mnemonicIndexesToCheck[2]]];
        for (let i = 0; i < 3; i++) {
            if (!answer?.includes(selectedMnemonicWords[i])) {
                correct = false;
                break;
            }
        }
        correctWords = correct;
    }
    $: selectedMnemonicWords, checkSelectedWords();

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
        <h1 class="text-2xl font-bold text-zinc-100 mb-3 pb-3 border-b">Create Wallet</h1>
        
        <!-- progress bar -->
        <div class="untheme flex justify-center items-center gap-2 mb-3">
            <div class="untheme w-full border-b {step>=1?"border-green-400":""}"/>
            <span class="{step>=1?"text-green-400":""}">1</span>
            <div class="untheme w-full border-b {step>1?"border-green-400":""}"/>
            <span class="{step>1?"text-green-400":""}">2</span>
            <div class="untheme w-full border-b {step>2?"border-green-400":""}"/>
            <span class="{step>2?"text-green-400":""}">3</span>
            <div class="untheme w-full border-b {step>3?"border-green-400":""}"/>
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
            <div class="pt-2 pb-1">
                
                <Checkbox
                    label="I have read and agree to the <a href='#'' target='_blank'><span class='text-green-400 hover:underline'>Terms of Service</span></a>."
                    bind:checked={termnsAccepted}
                />
            </div>
            <Button
                label="Create"
                disabled={!passworMatch || !termnsAccepted}
                on:click={async () => {
                    try {
                        showLoading.set(true);
                        if(passwordStrength !== PasswordStrengthLevels.VeryStrong && passwordStrength !== PasswordStrengthLevels.Strong && passwordStrength !== PasswordStrengthLevels.Good) {
                            window.alert("Your password is not strong enough. Please try again.");
                            showLoading.set(false);
                            return;
                        }
                        if(!passworMatch) {
                            window.alert("Your passwords do not match. Please try again.");
                            showLoading.set(false);
                            return;
                        }
                        const wallet = newWallet();
                        const encWallet = await wallet?.encrypt(password);
                        mnemonic = wallet?.mnemonic?.phrase || '';
                        publicKey = wallet?._signingKey()?.publicKey || '';
                        vault = await encryptMessage(encWallet || '', password);
                        step = 2;
                        showLoading.set(false);
                    } catch (error) {
                        debugError(error);
                        showLoading.set(false);
                        window.alert("Sorry, something went wrong. Please try again.");
                    }
                }}
            />
        </div>
        {:else if step===2}
        <div class="space-y-4">
            <!-- mnemonic verification -->
            <h2 class="text-lg font-medium">Secret phrase</h2>
            <div class="untheme border border-red-500 pt-2 px-2 rounded-md" style="font-size: 13px;">
                Please write down your secret phrase and keep it safe and don't share it with anyone. You will need it to recover your wallet, <span class="underline text-red-500">if you lose it you will lose access to your funds</span>.
                <!-- confirm checkbox -->
                <div class="mt-2 pt-2 border-t">
                    <Checkbox
                    label="I understand and I have written down my secret phrase"
                    bind:checked={confirmMnemonicWarning}
                />
                </div>
            </div>

            <div class="relative flex justify-center items-center py-2 px-0 w-full">
                <div class="grid grid-cols-4 gap-2{showMnemonic?"":" blur-md"} relative w-full">
                    {#if mnemonic}
                        {#each mnemonicWords as word}
                            <div class="p-1 border rounded-lg text-center cursor-default">
                                {word}
                            </div>
                        {/each} 
                    {/if}
                </div>
                {#if !showMnemonic}
                    <div class="absolute">
                        <Button
                            theme="tertiary"
                            label="Show phrase"
                            on:click={() => {
                                showMnemonic = true;
                            }}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 my-auto">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>                              
                        </Button>
                    </div>
                {/if}
            </div>

            <div class="flex justify-between items-center">
                <Button
                    theme="tertiary"
                    label="Copy"
                    on:click={() => {
                        navigator.clipboard.writeText(mnemonic);
                        toastActions.show("Copied to clipboard", {timeout: 1000});
                    }}
                    >
                    <Icon icon="document-duplicate" outline classList="w-4 h-4 my-auto"/>
                </Button>
                <Button
                    theme="primary"
                    label="Next"
                    disabled={!confirmMnemonicWarning}
                    on:click={() => {
                        if(confirmMnemonicWarning) step = 3;
                    }}
                />
            </div>
        </div>
        {:else if step===3}
        <div class="space-y-4">
            <!-- mnemonic verification -->
            <h2 class="text-lg font-medium">Secret phrase</h2>
            <span class="text-sm">
                Select the {numberToOrderShort(mnemonicIndexesToCheck[0]+1)}, {numberToOrderShort(mnemonicIndexesToCheck[1]+1)} and {numberToOrderShort(mnemonicIndexesToCheck[2]+1)} words from your secret phrase. 
            </span>
            <div class="grid grid-cols-4 gap-2">
                {#if mnemonic}
                    {#each shuffledMnemonic as word}
                        <div
                            class="p-1 cursor-pointer border rounded-lg text-center {selectedMnemonicWords.includes(word)?"bg-green-500":"hover:bg-zinc-500/[0.1]"}"
                            on:click={()=>{
                                if(selectedMnemonicWords.includes(word)) {
                                    selectedMnemonicWords = selectedMnemonicWords.filter((w) => w !== word);
                                } else {
                                    if(selectedMnemonicWords.length >= 3) return;
                                    selectedMnemonicWords = [...selectedMnemonicWords, word];
                                }
                            }}
                            on:keyup
                            >
                            {word}
                        </div>
                    {/each} 
                {/if}
            </div>
            
            <div class="flex justify-between items-center">
                <Button
                    theme="tertiary"
                    label="Back"
                    on:click={() => {
                        showMnemonic = false;
                        step = 2;
                    }}
                />
                <Button
                    theme="primary"
                    label="Done"
                    disabled={!correctWords}
                    on:click={async () => {
                        try {
                            if(vault?.stringified && publicKey) {
                                showLoading.set(true);
                                let res = await createWallet(vault.stringified, publicKey);
                                writeLocalStorage('blw-pk', publicKey);
                            } else throw new Error("Sorry, something went wrong. Please try again.");
                        } catch (error) {
                            debugError(error);
                        } finally {
                            showLoading.set(false);
                        }
                    }}
                />
            </div>
        </div>
        {/if}
    </section>
</div>

<Toast bind:actions={toastActions}/>