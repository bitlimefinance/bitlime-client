import { _WALLETS } from "$lib/globals";
import { setConnected } from "$lib/stores/application";
import { tick } from "svelte";
import { metamaskAccounts } from "../eip-1193";
import { setProvider, web3Provider } from "../web3/provider/lib";

// export const metamaskInstalled: boolean = ethereumSupported() && window.ethereum.isMetaMask;

export const connectMetamask = async () => {
    try {
        if(window.ethereum){
            if(!web3Provider) await setProvider();
            await web3Provider.send('eth_requestAccounts', []);
            const connectedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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