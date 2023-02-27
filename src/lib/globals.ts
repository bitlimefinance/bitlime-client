import { writable } from "svelte/store";
import type { WalletInfo } from "./core/descriptors/interfaces";
import { connectMetamask } from "./core/sdk/wallets/metamask";


export const _themes: Readonly<{
    light: string;
    dark: string;
}> = Object.freeze({
    light: 'light',
    dark: 'dark'
});

export const _messages: Readonly<{generalError: string}> = Object.freeze({
    generalError: "Sorry, something went wrong. Please check the validity of your data. Sometimes refreshing the page while clearing the cache using 'Ctrl/Cmd + Shift + R' on Chrome can help."
});

export const _analyticsDomainsWhitelist: Array<string> = [''];

export const _localStoragePrefix = 'bl-localstorage';

export enum _WALLETS {
    DISCONNECTED = 'disconnected',
    METAMASK = 'metamask',
    WALLETCONNECT = 'walletconnect',
    COINBASE = 'coinbase',
    BITLIME = 'bitlime',
}

export const showBlw = writable(false);

export const _WALLETS_INFO: ReadonlyArray<WalletInfo> = [
    {
        wallet: _WALLETS.BITLIME,
        name: 'Bitlime',
        logo: 'assets/wallets-logos/bitlime.png',
        popularBadge: false,
        supported: true,
        function: ()=>{showBlw.set(true)}
    },
    {
        wallet: _WALLETS.METAMASK,
        name: 'Metamask',
        logo: 'assets/wallets-logos/metamask-logo.png',
        popularBadge: false,
        supported: true,
        function: ()=>{connectMetamask()}
    },
    {
        wallet: _WALLETS.WALLETCONNECT,
        name: 'WalletConnect',
        logo: 'assets/wallets-logos/WalletConnect-Logo.png',
        popularBadge: false,
        supported: false,
        function: null
    },
    {
        wallet: _WALLETS.COINBASE,
        name: 'Coinbase Wallet',
        logo: 'assets/wallets-logos/coinbase-wallet-logo.png',
        popularBadge: false,
        supported: false,
        function: null
    }
];
