import { debug, debugError, debugWarn } from "$lib/core/utils/debug";
import { ethers } from "ethers";
import { writable, type Writable } from "svelte/store";

export const web3Ready_: Writable<boolean> = writable(false);

export let web3Provider: any;

export const setProvider = async (rpc?: string, blw?: boolean) => {
    debug('rpc',rpc);
    try {
        if(blw){
            web3Provider = new ethers.providers.JsonRpcProvider(rpc || 'https://rpc.ankr.com/eth');
            web3Ready_.set(true);
            return;
        }
        if (window && window?.ethereum && !rpc) web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        else web3Provider = new ethers.providers.JsonRpcProvider(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
        web3Ready_.set(true);
    } catch (error) {
        debugWarn(error);
        try {
            web3Provider = new ethers.providers.JsonRpcProvider(rpc || 'https://rpc.ankr.com/eth');
            web3Ready_.set(true);
        } catch (error) {
            debugError(error);
        }
    }
}