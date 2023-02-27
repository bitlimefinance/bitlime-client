import type { BigNumber } from "ethers";
import { writable, type Writable } from "svelte/store";
import type { TxInfo } from "./worker/types";

export const workerLoaded: Writable<boolean> = writable(false);

export const txConfirmation: Writable<boolean> = writable(false);

export const txInfo: Writable<TxInfo> = writable();