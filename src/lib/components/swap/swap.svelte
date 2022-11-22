<script lang="ts">
	import { _contracts } from "$lib/contractsReference";
	import { getTokensList } from "$lib/core/contents/apis";
	import { tokens } from "$lib/core/contents/backups";
	import { allowance, balanceOf, decimals } from "$lib/core/utils/erc20Utils";
	import { sleep } from "$lib/core/utils/utilities";
	import { getTransactionObject, readSmartContract } from "$lib/core/web3Manager";
	import { _WALLETS } from "$lib/globals";
	import { sendTransactionMetamask } from "$lib/metamask/core";
	import { accounts, connected, latestBlock, selectedNetwork, showConnenct, tokensList } from "$lib/stores/application";
	import { onMount } from "svelte";
    import Button from "../general/button.svelte";
	import SwapInput from "./swapInput.svelte";

    let mounted: boolean = false;

    let inputAValue: any;
    let inputBValue: any;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

    let selectedTokenA: any = {};
    let selectedTokenB: any = {};

    let selectedTokenADecimals: any;
    let selectedTokenBDecimals: any;

    let selectedTokenABalance: any;
    let selectedTokenBBalance: any;

    let tokenNeedsAllowance: boolean = false;

    let gettingData: boolean = false;

    const getTokenDecimals = (address: string, callback: FunctionStringCallback) => {
        if(!address || address == '') return;
        gettingData = true;
        decimals({tokenAddress: address})
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            // console.error(err);
            gettingData = false;
        }) 
    }

    const getTokenBalance = (address: string, callback: FunctionStringCallback) => {
        if(!address || address == '') return;
        gettingData = true;
        balanceOf({
            address: $accounts[0],
            tokenAddress: address,
        })
        .then((data) => {
            callback(data);
        })
        .catch((err) => {
            // console.error(err);
            gettingData = false;
        }) 
    }

    const checkAllowance = () => {
        if(!selectedTokenA?.address || selectedTokenA?.address == '') return;
        gettingData = true;
        balanceOf({
            address: $accounts[0],
            tokenAddress: selectedTokenA.address,
        })
        .then((res) => {
            let balance = parseFloat(res);
            selectedTokenABalance = balance;
            if(res == 0) {
                return;
            }
            allowance({
                address: $accounts[0],
                tokenAddress: selectedTokenA.address,
                spender: _contracts.router.address,
            })
            .then((data) => {
                let allowanceAmount = parseFloat(data);
                if(allowanceAmount == 0) tokenNeedsAllowance = true;
                else if(allowanceAmount>=balance) tokenNeedsAllowance = false;
                else tokenNeedsAllowance = true;
            })
            .catch((err) => {
                // console.error(err);
                gettingData = false;
            })

        })
        .catch((err) => {
            // console.error(err);
            gettingData = false;
        }) 
    }

    $: selectedTokenA, checkAllowance();
    $: selectedTokenB, getTokenBalance(selectedTokenB?.address, (data) => {
        selectedTokenBBalance = parseInt(data);
        gettingData = false;
    });
    $: selectedTokenA, getTokenDecimals(selectedTokenA?.address, (data) => {
        selectedTokenADecimals = parseInt(data);
        gettingData = false;
    });
    $: selectedTokenB, getTokenDecimals(selectedTokenB?.address, (data) => {
        selectedTokenBDecimals = parseInt(data);
        gettingData = false;
    });

    selectedNetwork.subscribe(() => {
        if(mounted) {
            inputAValue = undefined;
            inputBValue = undefined;
            selectedTokenA = undefined;
            selectedTokenB = undefined;
            selectedTokenADecimals = undefined;
            selectedTokenBDecimals = undefined;
        }
    })

    const onSwap = async () => {
        if(!(selectedTokenA?.address && selectedTokenB.address)) return;
        try {
            getTokenDecimals(selectedTokenA.address, (data) => {
                selectedTokenADecimals = parseInt(data);
                gettingData = false;
            });
            getTokenDecimals(selectedTokenB.address, (data) => {
                selectedTokenBDecimals = parseInt(data);
                gettingData = false;
            });
            checkAllowance();
            getTokenBalance(selectedTokenB.address, (data) => {
                selectedTokenBBalance = parseInt(data);
                gettingData = false;
            });
            await sleep(1000);
            if(gettingData || !selectedTokenADecimals || !selectedTokenBDecimals || tokenNeedsAllowance) return;
            
            if ($connected && $connected != _WALLETS.DISCONNECTED) {
                gettingData = true;
                if(!selectedTokenA?.address || !selectedTokenB?.address || !inputAValue || inputAValue==0) {
                    if(!inputAValue || inputAValue==0) {
                        inputA?.focus();
                        return;
                    }
                    window.alert('Please select tokens and enter amount');
                    return;
                }

                await getTransactionObject({
                    abi: _contracts.router.abi,
                    address: _contracts.router.address,
                    methodName: '0x05a1450d',
                    methodParams: [
                        (inputAValue*Math.pow(10,selectedTokenADecimals)), // amountIn
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
        } finally {
            gettingData = false;
        }
    }

    let switchHeight: number = 0;
    let switchWidthHalf: number = 0;
    $: switchWidthHalf = parseFloat((switchHeight/2).toFixed(4))-2;

    onMount(async () => {
        getTokensList().then((data) => {
            if (data?.results && data?.results.length > 0) tokensList.set(data?.results);
            else tokensList.set(tokens);
        })
        getTokenDecimals(selectedTokenA?.address, (data)=>{selectedTokenADecimals = parseInt(data)});
        getTokenDecimals(selectedTokenB?.address, (data)=>{selectedTokenBDecimals = parseInt(data)});
        mounted = true;
    });
</script>



<div class="rounded-xl p-4 w-11/12 max-w-lg">
    <div class="flex flex-col">
        <SwapInput
            bind:input={inputA}
            bind:selectedToken={selectedTokenA}
            bind:balance={selectedTokenABalance}
            bind:decimals={selectedTokenADecimals}
            id="swap-input-a"
            bind:value={inputAValue}
            />
        <div class="z-10" bind:clientHeight={switchHeight} style="margin-top: -{switchWidthHalf}px; margin-bottom: -{switchWidthHalf}px;">
            <div
                on:click={()=>{
                    let temp = selectedTokenA;
                    selectedTokenA=selectedTokenB;
                    selectedTokenB=temp;
                }}
                on:keyup
                class="bg-white dark:bg-zinc-800 cursor-pointer p-1.5 mx-auto w-fit border-4 border-emerald-100 dark:border-zinc-900 rounded-full"
                >
                <svg class="w-5 h-5 dark:text-zinc-500 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.4" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
            </div>              
        </div>

        <SwapInput
            bind:input={inputB}
            bind:selectedToken={selectedTokenB}
            bind:balance={selectedTokenBBalance}
            bind:decimals={selectedTokenBDecimals}
            id="swap-input-b"
            disabled
            bind:value={inputBValue}
            />
    </div>
    <Button
        showLoading={gettingData}
        label="{$connected==_WALLETS.DISCONNECTED || !$connected?'CONNECT A WALLET':(tokenNeedsAllowance?'APPROVE '+(selectedTokenA.name?selectedTokenA.name:'TOKEN'):'PLACE ORDER')}"
        additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-4"
        on:click={onSwap}/>
</div>