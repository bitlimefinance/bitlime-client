import type { Heroicon } from "$lib/icons/icons";
import type { _WALLETS } from "../../globals";

export interface TransactionParameters {
    to: string, // Required except during contract publications.
    from: any, // must match user's active address.
    value: any, // Only required to send ether to the recipient from the initiating external account.
    gasPrice?: any, // customizable by user during MetaMask confirmation.
    gas?: any, // customizable by user during MetaMask confirmation.
    data: any, // Optional, but used for defining smart contract creation and interaction.
    chainId?: any, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    nonce?: any, // ignored by MetaMask
}

export interface WalletInfo {
    wallet: _WALLETS;
    name: string;
    logo: string;
    popularBadge: boolean;
    supported: boolean;
    function: any;
}

    
export interface Token {
    "Modified Date": string;
    "Created Date": string;
    "Created By": string;
    "address": string;
    "chain": string;
    "image": string;
    "name": string;
    "symbol": string;
    "chain_id": string;
    "_id": string;
}

/*
actions = {
        open: open,
        dismiss: dismiss,
        stopTimeout: stopTimeout,
        startTimeout: startTimeout
    }
*/
export interface ToastActions {
    show: (message: string, options:{
        type?: 'info' | 'success' | 'warning' | 'error';
        icon?: Heroicon;
        iconOutline?: boolean;
        timeout?: number;
        positionY?: 'top' | 'bottom';
        positionX?: 'left' | 'right';
    }) => void;
    dismiss: () => void;
    stopTimeout: () => void;
    startTimeout: () => void;
}
