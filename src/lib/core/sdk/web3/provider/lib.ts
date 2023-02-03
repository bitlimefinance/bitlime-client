import { debugError } from "$lib/core/utils/debug";
import { ethers } from "ethers";
import { writable } from "svelte/store";

export const web3Ready_ = writable(false);

export let web3Provider: any;

export const setProvider = async (rpc?: string) => {
    try {
        if (window?.ethereum && !rpc) web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        else web3Provider = new ethers.providers.JsonRpcProvider(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
        web3Ready_.set(true);
    } catch (error) {
        debugError(error);
    }
}