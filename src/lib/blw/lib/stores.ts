import { writable, type Writable } from "svelte/store";

export const workerLoaded: Writable<boolean> = writable(false);

export const txConfirmation: Writable<boolean> = writable(false);

export const showBlw: Writable<boolean> = writable(false);