<script lang="ts">
	import { _contracts } from "$lib/contractsReference";
	import { getTokensList } from "$lib/core/contents/apis";
	import { tokens } from "$lib/core/contents/fallbacks";
	import { ROUTER_ABI, ROUTER_ADDRESS, swapExactETHForTokens, swapExactTokensForTokens } from "$lib/core/sdk/router";
	import { allowance, balanceOf, decimals, ERC20_ABI } from "$lib/core/sdk/erc20";
	import { sleep } from "$lib/core/utils/utilities";
	import { getBalance, getTransactionObject, noOfDecimalsToUnits, readSmartContract } from "$lib/core/sdk/web3";
	import { _WALLETS } from "$lib/globals";
	import { sendTransactionMetamask } from "$lib/metamask/core";
	import { accounts, connected, latestBlock, selectedNetwork, showConnenct, tokensList } from "$lib/stores/application";
	import { onMount } from "svelte";
    import Button from "../general/button.svelte";
	import Tooltip from "../general/tooltip.svelte";
	import SwapInput from "./swapInput.svelte";
	import { FACTORY_ABI, FACTORY_ADDRESS } from "$lib/core/sdk/factory";
	import { PAIR_ABI } from "$lib/core/sdk/pair";


    let mounted: boolean = false;

    let inputAValue: any;
    let inputBValue: any;

    let inputA: HTMLInputElement;
    let inputB: HTMLInputElement;

    export let selectedTokenA: any = {};
    export let selectedTokenB: any = {};

    let selectedTokenADecimals: any;
    let selectedTokenBDecimals: any;

    let selectedTokenABalance: any;
    let selectedTokenBBalance: any;

    let tokenNeedsAllowance: boolean = false;
    let noBalance: boolean = false;

    let gettingData: boolean = false;
    let gettingQuote: boolean = false;
    let switching: boolean = false;

    const getTokenDecimals = async (address: string, callback: FunctionStringCallback) => {
        if(!address) return;
        if(address == 'native') {
            callback($selectedNetwork?.decimals);
        }else{
            decimals({tokenAddress: address})
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    const getTokenBalance = async (address: string, callback: FunctionStringCallback) => {        
        if(!address) return;
        if(address == 'native') {
            getBalance($accounts[0])
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                console.error(err);
            })
        }else{
            balanceOf({
                address: $accounts[0],
                tokenAddress: address,
            })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                console.error(err);
            }); 
        }
        refreshCounter = refreshTimer;
    }

    const checkBalance = async () =>{   
        gettingData = true;
        if(selectedTokenA?.address) {
            getTokenBalance(selectedTokenA?.address, (data) => {
                try{
                    selectedTokenABalance = parseFloat(data);
                    if(selectedTokenABalance == 0 || selectedTokenABalance < (inputAValue*Math.pow(10, selectedTokenADecimals))) {
                        noBalance = true;
                        return; 
                    }
                    noBalance = false;
                }catch(err) {
                    console.error(err);
                }finally{
                    gettingData = false;
                }
            });
        }
        gettingData = true;
        if(selectedTokenB?.address) {
            getTokenBalance(selectedTokenB?.address, (data) => {
                try{
                    selectedTokenBBalance = parseFloat(data);
                }catch(err) {
                    console.error(err);
                }finally{
                    gettingData = false;
                }
            });
        }
    }

    const checkAllowance = async () => {
        if(!(selectedTokenA?.address)) return;
        gettingData = true;
        if(selectedTokenA?.address == 'native') {
            tokenNeedsAllowance = false;
            checkBalance();
            return;
        }
        balanceOf({
            address: $accounts[0],
            tokenAddress: selectedTokenA.address,
        })
        .then((res) => {
            let balance = parseFloat(res);
            selectedTokenABalance = balance;
            if(res == 0 || res < inputAValue) {
                noBalance = true;
                return; 
            }
            noBalance = false;
            allowance({
                address: $accounts[0],
                tokenAddress: selectedTokenA.address,
                spender: ROUTER_ADDRESS,
            })
            .then((data) => {
                let allowanceAmount = parseFloat(data);
                if(allowanceAmount == 0) tokenNeedsAllowance = true;
                else if(allowanceAmount>=balance) tokenNeedsAllowance = false;
                else tokenNeedsAllowance = true;
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                gettingData = false;
            })
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            gettingData = false;
        })
        refreshCounter = refreshTimer;
    }

    const checkDecimals = async () => {
        gettingData = true;
        if(selectedTokenB?.address){
            await getTokenDecimals(selectedTokenB?.address, (data) => {
                selectedTokenBDecimals = parseInt(data);
                gettingData = false;
            });
        }
        gettingData = true;
        if(selectedTokenA?.address){
            await getTokenDecimals(selectedTokenA?.address, (data) => {
                selectedTokenADecimals = parseInt(data);
                gettingData = false;
            });
        }
    }

    const getQuote = async () => {
        gettingData = true;
        gettingQuote = true;
        if(!(inputAValue && selectedTokenA?.address != 'native' && selectedTokenB?.address)) {
            gettingData = false;
            gettingQuote = false;
            inputBValue = '';
            return;
        }
        await readSmartContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            methodName: 'getPair',
            methodParams: [selectedTokenA.address, selectedTokenB.address],
        })
        .then((pairAddress) => {
            if(pairAddress == '0x0000000000000000000000000000000000000000') {
                inputBValue = 0;
                return;
            }
            readSmartContract({
                address: pairAddress,
                abi: PAIR_ABI,
                methodName: 'getReserves',
                methodParams: [],
            })
            .then(async (reserves) => {
                let amountToQuote = await window.web3.utils.toBN(await window?.web3.utils.toWei(inputAValue.toString(), noOfDecimalsToUnits(selectedTokenADecimals)));
                if(!amountToQuote) throw new Error('Something went wrong converting amount');                
                readSmartContract({
                    address: ROUTER_ADDRESS,
                    abi: ROUTER_ABI,
                    methodName: 'quote',
                    methodParams: [amountToQuote, reserves[0], reserves[1]]
                })
                .then((data) => {
                    inputBValue = parseFloat(data.substring(0,selectedTokenBDecimals))/Math.pow(10, selectedTokenBDecimals);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    gettingData = false;
                    gettingQuote = false;
                })
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                gettingData = false;
                gettingQuote = false;
            })
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            gettingData = false;
            gettingQuote = false;
        })
    }

    const onTokenChange = (doCheckAllowance: boolean = false) => {
        if(switching) return;
        gettingData = true;
        try {
            if(inputAValue && typeof inputAValue == 'number') inputAValue = parseFloat(inputAValue.toFixed(selectedTokenADecimals));
            if(inputBValue && typeof inputBValue == 'number') inputBValue = parseFloat(inputBValue.toFixed(selectedTokenBDecimals));
        } catch (error) {
            console.warn(error);
        }
        try{
            if(doCheckAllowance) checkAllowance();
            else checkBalance();
            checkDecimals();
            getQuote();
        }catch(err) {
            console.error(err);
        }finally{
            gettingData = false;
        }
    }

    $: inputAValue, onTokenChange();
    $: selectedTokenA, onTokenChange(true);
    $: selectedTokenB, onTokenChange();

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

    let canUpdateTrashold: boolean = true;
    const updateData = () =>{
        if(!canUpdateTrashold) return;
        canUpdateTrashold = false;
        try { 
            onTokenChange();
        } catch (error) {
            // console.error(error);
        } finally {
            setTimeout(() => {
                canUpdateTrashold = true;
            }, 2000);
        }
    }

    const onSwap = async () => {
        if(!(selectedTokenA?.address && selectedTokenB?.address && !noBalance && selectedTokenA?.address!=selectedTokenB?.address)) return;
        
        try {
            if(selectedTokenA.address == 'native') {
                let amountToWei = await window.web3.utils.toWei(inputAValue.toString(), noOfDecimalsToUnits(selectedTokenADecimals));
                
                swapExactETHForTokens({
                    to: $accounts[0],
                    address: selectedTokenB.address,
                    deadline: null,
                    callBack: async (data: any) => {
                        sendTransactionMetamask({
                            to: ROUTER_ADDRESS,
                            from: $accounts[0],
                            value: amountToWei,
                            data: data?.encodeABI(),
                            chainId: null,
                            gasPrice: null,
                            gas: null,
                            nonce: null
                        });
                    }
                });
                return;
            };
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
            if(gettingData || !selectedTokenADecimals || !selectedTokenBDecimals) return;
            if ($connected && $connected != _WALLETS.DISCONNECTED) {
                if(tokenNeedsAllowance){
                    await getTransactionObject({
                        abi: ERC20_ABI,
                        address: selectedTokenA.address,
                        methodName: 'approve',
                        methodParams: [
                            ROUTER_ADDRESS,
                            selectedTokenABalance+'000000000',
                        ],
                    })
                    .then(async (data)=>{
                        await sendTransactionMetamask({
                            to: selectedTokenA.address,
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
                }else {
                    gettingData = true;
                    if(!selectedTokenA?.address || !selectedTokenB?.address || !inputAValue || inputAValue==0) {
                        if(!inputAValue || inputAValue==0) {
                            inputA?.focus();
                            return;
                        }
                        window.alert('Please select tokens and enter amount');
                        return;
                    }

                    swapExactTokensForTokens({
                        amount: inputAValue*Math.pow(10, selectedTokenADecimals),
                        addressA: selectedTokenA?.address,
                        addressB: selectedTokenB?.address,
                        to: $accounts[0],
                        deadline: null,
                        slippage: null,
                        callBack: async (data: any) => {
                            await sendTransactionMetamask({
                                to: ROUTER_ADDRESS,
                                from: $accounts[0],
                                value: null,
                                data: data?.encodeABI(),
                                chainId: null,
                                gasPrice: null,
                                gas: null,
                                nonce: null
                            });
                        }
                    })
                }
            }else{
                showConnenct.set(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            gettingData = false;
        }
        refreshCounter = refreshTimer;
    }

    let switchHeight: number = 0;
    let switchWidthHalf: number = 0;
    let switchTimeout: boolean = false;
    $: switchWidthHalf = parseFloat((switchHeight/2).toFixed(4))-2;

    const switchTokens = () => {
        if(gettingData || switchTimeout) return;
        switching = true;
        switchTimeout = true;
        let tempToken = selectedTokenA;
        inputBValue = '';
        selectedTokenA = selectedTokenB;
        selectedTokenB = tempToken;
        switching = false;
        setTimeout(()=>{switchTimeout=false}, 800);
    }

    const refreshTimer: Readonly<number> = 30;
    export let refreshCounter: number = refreshTimer;
    onMount(async () => {
        getTokensList().then((data) => {
            if (data?.results && data?.results.length > 0) tokensList.set(data?.results);
            else tokensList.set(tokens);
        })
        mounted = true;
        setInterval(() => {
            if(selectedTokenA?.address || selectedTokenB?.address){
                if(refreshCounter>-1) refreshCounter--;
                if(refreshCounter<=-1){
                    if(gettingData) return;
                    if(!selectedTokenA?.address && !selectedTokenB?.address) return;
                    updateData();
                }
            }else{
                refreshCounter = refreshTimer;
            }
        }, 1000);
    });    
</script>

<div class="rounded-xl p-4 w-11/12 max-w-lg">
    <div class="flex justify-between items-end mb-3">
        <div class="text-zinc-900 dark:text-white font-medium text-2xl">
            Swap
        </div>
        <div class="flex justify-end gap-3 h-fit w-fit">   
            {#if selectedTokenA?.address || selectedTokenB?.address || selectedTokenA?.is_native || selectedTokenB?.is_native}
                <Tooltip content="Refresh">
                    <svg on:click={()=>{updateData()}} on:keyup xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300 {gettingData?'animate-spin':''}">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </Tooltip>
            {/if} 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
    </div>
    <div class="flex flex-col">
        <SwapInput
            bind:input={inputA}
            bind:selectedToken={selectedTokenA}
            bind:balance={selectedTokenABalance}
            bind:decimals={selectedTokenADecimals}
            selectedTokens={[selectedTokenA?.is_native?'native':selectedTokenA?.address || '', selectedTokenB?.is_native?'native':selectedTokenB?.address || '']}
            id="swap-input-a"
            bind:value={inputAValue}
            on:switch={switchTokens}
            />
        <div class="z-10" bind:clientHeight={switchHeight} style="margin-top: -{switchWidthHalf}px; margin-bottom: -{switchWidthHalf}px;">
            <div
                disabled={gettingData || switchTimeout}
                on:click={()=>{
                    if(gettingData || switchTimeout) return;
                    switching = true;
                    switchTimeout = true;
                    let tempToken = selectedTokenA;
                    let tempInput = inputBValue;
                    selectedTokenA = selectedTokenB;
                    selectedTokenB=tempToken;
                    inputBValue = '';
                    inputAValue = tempInput;
                    switching = false;
                    setTimeout(()=>{switchTimeout=false}, 800);
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
            selectedTokens={[selectedTokenA?.is_native?'native':selectedTokenA?.address || '', selectedTokenB?.is_native?'native':selectedTokenB?.address || '']}
            id="swap-input-b"
            disabled
            bind:value={inputBValue}
            loading={gettingQuote}
            on:switch={switchTokens}
            />
    </div>
    {#if noBalance || !selectedTokenA?.address || !selectedTokenB?.address}
        <Button
            showLoading={gettingData}
            disabled
            label="{noBalance?"You don't have enough balance":"Select tokens"}"
            additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-4 bg-gray-300 hover:bg-gray-300 dark:bg-zinc-800 hover:dark:bg-zinc-800"
            />
    {:else}
        <Button
            showLoading={gettingData}
            label="{$connected==_WALLETS.DISCONNECTED || !$connected?'CONNECT A WALLET':(tokenNeedsAllowance?'APPROVE '+(selectedTokenA.name?selectedTokenA.name:'TOKEN'):'PLACE ORDER')}"
            additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-4"
            on:click={onSwap}/>
    {/if}
</div>