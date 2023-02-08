import type { BigNumber } from "ethers";
import { writable, type Writable } from "svelte/store";

export const workerLoaded: Writable<boolean> = writable(false);

export const txConfirmation: Writable<boolean> = writable(false);

export const txInfo: Writable<{
    to: string;
    methodName: string;
    from?: string;
    value?: string;
    estimatedGas: string;
    data?: string;
    nonce?: string;
    chainId: string;
    callback: any;
}> = writable();