import { _WALLETS } from "$lib/globals";
import { setConnected } from "$lib/stores/application";
import { tick } from "svelte";
import { ethereumSupported, metamaskAccounts } from "../eip-1193";

export const metamaskInstalled: boolean = ethereumSupported() && window.ethereum.isMetaMask;

export const metamaskInstalledAsync: boolean = ethereumSupported() && await window.ethereum.request({
    method: 'web3_clientVersion'
  }).then((clientVersion) => {
    return window.ethereum.isMetaMask && clientVersion.split('/')[0] !== 'MetaMask'
  })

export const connectMetamask = async () => {
    try {
        if(metamaskInstalled){
            let connectedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            metamaskAccounts.set(connectedAccounts);
            await tick();
            setConnected(_WALLETS.METAMASK);
        }else{
            console.log('Metamask not installed');
        }
    } catch (error) {
        console.error(error);
    }
}