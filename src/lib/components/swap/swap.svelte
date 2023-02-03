<script lang="ts">
	import { _contracts } from "$lib/contractsReference";
	import { getAmountsOut, getNativeToken, methodsSwitcher, ROUTER_ADDRESS} from "$lib/core/sdk/router";
	import { allowance, approve, balanceOf, decimals } from "$lib/core/sdk/erc20";
	import { sleep } from "$lib/core/utils/utilities";
	import { _WALLETS } from "$lib/globals";
	import { accounts, connected, selectedNetwork, showConnenct } from "$lib/stores/application";
	import { onMount } from "svelte";
    import Button from "../general/button.svelte";
	import Tooltip from "../general/tooltip.svelte";
	import SwapInput from "./swapInput.svelte";
	import { SyncLoader } from "svelte-loading-spinners";
	import SwapSettings from "./swapSettings.svelte";
	import { debug, debugBreakpoint, debugBreakpointReset, debugError, debugWarn } from "$lib/core/utils/debug";
	import { fromWei, noOfDecimalsToUnits, toWei } from "$lib/core/sdk/web3/utils/units/lib";
	import { web3Provider } from "$lib/core/sdk/web3/provider/lib";
	import { getAddressBalance } from "$lib/core/sdk/web3/utils/addresses/lib";
	import { fromBigNumber, toBigNumber } from "$lib/core/sdk/web3/utils/bigNumber/lib";

    let mounted: boolean = false;

    let nativeTokenAddress: string;

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

    let swapRate: number | string = 0;
    let gettingSwapRate: boolean = false;
    let swapRatePath: any[] = [selectedTokenA, selectedTokenB];
    let swapRatePathDecimals: any[] = [selectedTokenADecimals, selectedTokenBDecimals];

    const getTokenDecimals = async (address: string, callback: FunctionStringCallback) => {
        if(!address) return;
        if(address == 'native') {
            await callback($selectedNetwork?.decimals);
        }else{
            await decimals({tokenAddress: address})
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                debugError(err);
            })
        }
    }

    const getTokenBalance = async (address: string, callback: FunctionStringCallback) => {        
        if(!address && $accounts?.length <= 0) return;
        if(address === 'native' && $accounts[0]) {
            getAddressBalance($accounts[0])
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                debugError(err);
            })
        }else{
            balanceOf({
                address: $accounts[0],
                tokenAddress: address,
            })
            .then((data) => {
                callback(data.toString());
            })
            .catch((err) => {
                debugError(err);
            }); 
        }
        refreshCounter = refreshTimer;
    }

    const checkBalance = async () =>{   
        gettingData = true;
        if(selectedTokenA?.address) {
            getTokenBalance(selectedTokenA?.address, async (data) => {
                try{
                    selectedTokenABalance = parseFloat(data);
                    if(selectedTokenABalance == 0 || selectedTokenABalance < (inputAValue*Math.pow(10, selectedTokenADecimals))) {
                        noBalance = true;
                        return; 
                    }
                    noBalance = false;
                }catch(err) {
                    debugError(err);
                }finally{
                    gettingData = false;
                }
            });
        }
        gettingData = true;
        if(selectedTokenB?.address) {
            getTokenBalance(selectedTokenB?.address, async (data) => {
                try{
                    selectedTokenBBalance = parseFloat(data);
                }catch(err) {
                    debugError(err);
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
            let balance = res;
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
                debugError(err);
            })
            .finally(() => {
                gettingData = false;
            })
        })
        .catch((err) => {
            debugError(err);
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

    const getQuote = async (getSwapRate?: boolean) => {
        try{
            let value = getSwapRate?1:inputAValue;
            let unorderedPathDirty: boolean = !([selectedTokenA.address, selectedTokenB.address].includes(swapRatePath[0].address) && [selectedTokenA.address, selectedTokenB.address].includes(swapRatePath[1].address));
            if(unorderedPathDirty) {
                swapRatePath = [selectedTokenA, selectedTokenB];
                swapRatePathDecimals = [selectedTokenADecimals, selectedTokenBDecimals];
            }
            
            let path = getSwapRate?swapRatePath:[selectedTokenA, selectedTokenB];
            let pathDecimals = getSwapRate?swapRatePathDecimals:[selectedTokenADecimals, selectedTokenBDecimals];
            if(!getSwapRate) gettingData = true;
            if(!getSwapRate) gettingQuote = true;
            if(getSwapRate) gettingSwapRate = true;
            if(!(value && path[0]?.address && path[1]?.address)) {
                gettingData = false;
                gettingQuote = false;
                if(!getSwapRate) inputBValue = '';
                return;
            }
            nativeTokenAddress = await getNativeToken();
            let _tokenA = path[0].address;
            let _tokenB = path[1].address;
            if(_tokenA == 'native') _tokenA = nativeTokenAddress;
            if(_tokenB == 'native') _tokenB = nativeTokenAddress;
            
            let amountToQuote = toWei(value.toString(), noOfDecimalsToUnits(pathDecimals[0]));
            if(!amountToQuote) throw new Error('Something went wrong converting amount');
            
            let bnQuote = await getAmountsOut({
                amountIn: amountToQuote,
                tokenAddressA: _tokenA,
                tokenAddressB: _tokenB
            });

            if(!bnQuote) throw new Error('Something went wrong getting quote');

            let quote: any[] = [fromBigNumber(bnQuote[0][0]), fromBigNumber(bnQuote[0][1])];
            let res = fromWei(quote[1].toString(), noOfDecimalsToUnits(pathDecimals[1]));
            if(getSwapRate) swapRate = res as string;
            else inputBValue = res;
        }catch(err) {
            debugError(err);
        }finally{
            gettingData = false;
            gettingQuote = false;
            gettingSwapRate = false;
        }
    }

    const fetchTokenInfo = async (doCheckAllowance: boolean = false) => {
        if(switching) return;
        gettingData = true;
        try {
            if(inputAValue && typeof inputAValue == 'number') inputAValue = parseFloat(inputAValue.toFixed(selectedTokenADecimals));
            if(inputBValue && typeof inputBValue == 'number') inputBValue = parseFloat(inputBValue.toFixed(selectedTokenBDecimals));
        } catch (error) {
            debugWarn(error);
        }
        try{
            if(doCheckAllowance) await checkAllowance();
            else await checkBalance();
            await checkDecimals();
            await getQuote();
            await getQuote(true);
        }catch(err) {
            debugError(err);
        }finally{
            gettingData = false;
        }
    }

    $: inputAValue, fetchTokenInfo();
    $: selectedTokenA, fetchTokenInfo(true);
    $: selectedTokenB, fetchTokenInfo();

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
            fetchTokenInfo();
        } catch (error) {
            // debugError(error);
        } finally {
            setTimeout(() => {
                canUpdateTrashold = true;
            }, 2000);
        }
    }

    const onSwap = async () => {
        if(!(selectedTokenA?.address && selectedTokenB?.address && !noBalance && selectedTokenA?.address!=selectedTokenB?.address)) return;
        try {
            debugBreakpointReset();
            debugBreakpoint();
            let amountToWei: string | null = '0';
            if(selectedTokenA.address == 'native' || selectedTokenB.address == 'native') {
                amountToWei = toWei(await inputAValue.toString() || '0', noOfDecimalsToUnits(selectedTokenADecimals));
                debugBreakpoint();
                await methodsSwitcher({
                    to: $accounts[0],
                    tokenAddressA: selectedTokenA.address,
                    tokenAddressB: selectedTokenB.address,
                    amountIn: amountToWei
                });
                return;
            };
            debugBreakpoint();
            await fetchTokenInfo(true);
            await sleep(1000);
            debugBreakpoint();
            if(gettingData || !selectedTokenADecimals || !selectedTokenBDecimals) return;
            if ($connected && $connected != _WALLETS.DISCONNECTED) {
                if(tokenNeedsAllowance){
                    await approve({
                        tokenAddress: selectedTokenA.address,
                        spenderAddress: ROUTER_ADDRESS,
                        amount: toWei(await selectedTokenABalance.toString(), noOfDecimalsToUnits(selectedTokenADecimals))+'000000000',
                        ownerAddress: $accounts[0]
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
                    amountToWei = toWei(await inputAValue.toString(), noOfDecimalsToUnits(selectedTokenADecimals));
                    await methodsSwitcher({
                        to: $accounts[0],
                        tokenAddressA: selectedTokenA.address,
                        tokenAddressB: selectedTokenB.address,
                        amountIn: amountToWei
                    });
                }
            }else{
                showConnenct.set(true);
            }
        } catch (error) {
            debugError(error);
        } finally {
            gettingData = false;
        }
        refreshCounter = refreshTimer;
    }

    let switchHeight: number = 0;
    let switchWidthHalf: number = 0;
    let switchTimeout: boolean = false;
    $: switchWidthHalf = parseFloat((switchHeight/2).toFixed(4))-2;

    const refreshTimer: Readonly<number> = 30;
    export let refreshCounter: number = refreshTimer;
    onMount(async () => {
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
    <div class="flex justify-between items-center mb-3">
        <div class="text-zinc-900 dark:text-white font-medium text-2xl">
            Swap
        </div>
        <div class="flex justify-end items-center gap-3 h-fit w-fit">   
            {#if selectedTokenA?.address || selectedTokenB?.address || selectedTokenA?.is_native || selectedTokenB?.is_native}
                <Tooltip content={`
                    Click to update data<br>
                    <div class="text-xs opacity-60">Auto update in ${refreshCounter}</div>
                `}>
                    <svg on:click={()=>{updateData()}} on:keyup xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:opacity-70 text-zinc-900 dark:text-zinc-300 {gettingData?'animate-spin':''}">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </Tooltip>
            {/if}
            <SwapSettings/>
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
            />
        <div class="z-10" bind:clientHeight={switchHeight} style="margin-top: -{(switchWidthHalf)}px; margin-bottom: -{(switchWidthHalf)}px;">
            <div class="rounded-full border border-zinc-400 w-fit mx-auto dark:border-0">
                <div
                    disabled={gettingData || switchTimeout}
                    on:click={()=>{
                        if(gettingData || switchTimeout) return;
                        switching = true;
                        switchTimeout = true;
                        inputBValue = '';
                        inputAValue = '';
                        let tempToken = selectedTokenA;
                        selectedTokenA = selectedTokenB;
                        selectedTokenB=tempToken;
                        switching = false;
                        setTimeout(()=>{switchTimeout=false}, 800);
                    }}
                    on:keyup
                    class="untheme bg-zinc-50 dark:bg-zinc-800 cursor-pointer p-1.5 mx-auto w-fit border-4 border-zinc-50 dark:border-zinc-900 rounded-full"
                    >
                    <svg class="w-5 h-5 text-zinc-800 dark:text-zinc-500 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.4" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                    </svg>
                </div> 
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
            />
    </div>
    {#if swapRatePath[0] && swapRatePath[1] && swapRate}
        <div class="flex justify-center items-center gap-2 w-full text-sm text-gray-900 dark:text-zinc-200 mt-6 mb-3">
            {#if !gettingSwapRate}
                <div>
                    1 {swapRatePath[0].symbol} = {swapRate} {swapRatePath[1].symbol}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 cursor-pointer"
                    on:click={()=>{
                        swapRatePathDecimals = [swapRatePathDecimals[1], swapRatePathDecimals[0]];
                        swapRatePath = [swapRatePath[1], swapRatePath[0]];
                        getQuote(true);
                    }}
                    on:keyup
                    >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
            {:else}
                <SyncLoader size="20" color="#94949450" unit="px" duration="1s"/>
            {/if}
        </div>
    {/if}
    {#if noBalance || !selectedTokenA?.address || !selectedTokenB?.address}
        <Button
            showLoading={gettingData}
            disabled
            label="{noBalance?"You don't have enough balance":"Select tokens"}"
            additionalClassList="min-w-full justify-center items-center font-normal text-base rounded-xl px-4 py-5 mt-4 bg-gray-300 hover:bg-gray-300 dark:bg-zinc-800 hover:dark:bg-zinc-800"
            style='min-height: 64px;'
            />
    {:else}
        <Button
            showLoading={gettingData}
            label="{$connected==_WALLETS.DISCONNECTED || !$connected?'CONNECT A WALLET':(tokenNeedsAllowance?'APPROVE '+(selectedTokenA?.symbol || 'TOKEN'):'PLACE ORDER')}"
            additionalClassList="min-w-full justify-center font-normal text-base rounded-xl px-4 py-5 mt-4"
            style='min-height: 64px;'
            on:click={onSwap}
            />
    {/if}
</div>

