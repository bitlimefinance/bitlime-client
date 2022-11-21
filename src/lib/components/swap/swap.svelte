<script lang="ts">
	import { _contracts } from "$lib/contractsReference";
	import { getTokensList } from "$lib/core/contents/token-list";
	import { getTransactionObject } from "$lib/core/web3Manager";
	import { _WALLETS } from "$lib/globals";
	import { sendTransactionMetamask } from "$lib/metamask/core";
	import { accounts, connected, latestBlock, showConnenct, tokensList } from "$lib/stores/application";
	import { onMount } from "svelte";
    import Button from "../general/button.svelte";
	import SwapInput from "./swapInput.svelte";
    
    onMount(async () => {
        getTokensList().then((data) => {
            tokensList.set(data?.results);
        })
    });

    let inputAValue: number;
    let inputBValue: number;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

    let selectedTokenA: any = {};
    let selectedTokenB: any = {};

    const onSwap = () => {
        try {
            if ($connected && $connected != _WALLETS.DISCONNECTED) {
                if(!selectedTokenA?.address || !selectedTokenB?.address || !inputAValue || inputAValue==0) {
                    if(!inputAValue || inputAValue==0) {
                        inputA?.focus();
                        return;
                    }
                    window.alert('Please select tokens and enter amount');
                    return;
                }
                
                getTransactionObject({
                    abi: _contracts.router.abi,
                    address: _contracts.router.address,
                    methodName: '0x05a1450d',
                    methodParams: [
                        (inputAValue*Math.pow(10,6)), // amountIn
                        0, // amountOutMin
                        [selectedTokenA.address,selectedTokenB.address], // path
                        $accounts[0], // to
                        $latestBlock + 10, // deadline
                        _contracts.address0 // feeTo
                    ],
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
            }else{
                showConnenct.set(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    let switchHeight: number = 0;
    let switchWidthHalf: number = 0;
    $: switchWidthHalf = parseFloat((switchHeight/2).toFixed(4))-2;
</script>



<div class="rounded-xl p-4 w-11/12 max-w-lg">
    <!-- <div class="flex justify-between pb-3">
        <div>
            <p class="font-medium text-xl">Swap</p>
        </div>
    </div> -->
    <div class="flex flex-col">
        <SwapInput
            bind:input={inputA}
            bind:selectedToken={selectedTokenA}
            defaultToken='usdc'
            id="swap-input-a"
            bind:value={inputAValue}
            />
        <div
            on:click={()=>{
                let temp = selectedTokenA;
                selectedTokenA=selectedTokenB;
                selectedTokenB=temp;
            }}
            on:keyup
            class="z-10" bind:clientHeight={switchHeight}
            style="margin-top: -{switchWidthHalf}px; margin-bottom: -{switchWidthHalf}px;"
            >
            <div class="bg-white dark:bg-zinc-800 cursor-pointer p-1.5 mx-auto w-fit border-4 border-emerald-100 dark:border-zinc-900 rounded-full">
                <svg class="w-5 h-5 dark:text-zinc-500 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.4" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
            </div>              
        </div>

        <SwapInput
            bind:input={inputB}
            bind:selectedToken={selectedTokenB}
            id="swap-input-b"
            disabled
            bind:value={inputBValue}
            />
    </div>
    <Button
        label="{$connected==_WALLETS.DISCONNECTED || !$connected?'CONNECT A WALLET':'PLACE ORDER'}"
        additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-4"
        on:click={onSwap}/>
</div>