<script lang="ts">
	import { _contracts } from "$lib/contractsReference";
	import { getTransactionObject } from "$lib/core/web3Manager";
	import { sendTransactionMetamask } from "$lib/metamask/core";
	import { accounts, latestBlock } from "$lib/stores/application";
    import Button from "../general/button.svelte";
    import Input from "../general/input.svelte";
	import SwapInput from "./swapInput.svelte";

    let inputAValue: number;
    let inputBValue: number;
</script>



<div class="rounded-xl p-4 w-11/12 max-w-lg bg-white dark:bg-neutral">
    <div class="flex justify-between pb-3">
        <div>
            <p class="font-medium text-xl">Swap</p>
        </div>
    </div>
    <div class="flex flex-col">
        <SwapInput
            id="swap-input-a"
            bind:value={inputAValue}
            />
        <div class="z-10">
            <div class="bg-emerald-500 hover:bg-emerald-700 dark:bg-emerald-900 dark:hover:bg-emerald-700 cursor-pointer p-1 mx-auto w-fit -my-3 border-4 border-base-100 dark:border-neutral rounded-lg">
                <svg class="w-5 h-5 text-white dark:text-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
            </div>              
        </div>

        <SwapInput
            id="swap-input-b"
            bind:value={inputBValue}
            />
    </div>
    <Button
        label="Swap"
        classList="bg-primary text-slate-800 font-medium min-w-full justify-center rounded-lg px-4 py-2 mt-5 hover:bg-primary-focus"
        on:click={async ()=>{
            getTransactionObject({
                abi: _contracts.router.abi,
                address: _contracts.router.address,
                methodName: '0x05a1450d',
                methodParams: [10000,0,["0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C","0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"], $accounts[0], $latestBlock + 100, _contracts.address0]
            })
            .then(async (data)=>{
                await sendTransactionMetamask({
                    to: _contracts.router.address,
                    from: $accounts[0],
                    value: null,
                    data: data?.encodeABI(),
                    chainId: null,
                    gasPrice: null,
                    gas: null,
                    nonce: null
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        }}/>
</div>