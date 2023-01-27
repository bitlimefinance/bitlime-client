import { debugError } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { ENV } from "$lib/stores/envVars";
import { writable, get } from "svelte/store";
import type { ToWorkerMessage } from "./types";
import { workerLoaded } from "../stores";

export const blwWorker = writable();

export const loadWorker = async () => {
	try {
		const SyncWorker = await import('./blw.worker?worker');
		const syncWorker = new SyncWorker.default();
		blwWorker.set(syncWorker);
        workerLoaded.set(true);
	} catch (error) {
		debugError(error);
	}
  };

export const workerValidator = () => {
	try {
		const wrkr = get(blwWorker) as Worker;
		if (!wrkr) throw new Error('Worker not found');
	} catch (error) {
		debugError(error);
	}
}

export const workerPostMessage = (message: ToWorkerMessage) => {
	try {
		if (!message) throw new Error('Message not found');
		workerValidator();
		const wrkr = get(blwWorker) as Worker;
		const enrichedMessage = {
			...message,
			env: get(ENV) || Env.PROD,
		};
		wrkr?.postMessage(JSON.stringify(enrichedMessage));
	} catch (error) {
		debugError(error);
	}
}

export const workerListener = (callback: any) => {
	try {
		workerValidator();
		const wrkr = get(blwWorker) as Worker;
		wrkr.onmessage = async (e) => callback(e);
	} catch (error) {
		debugError(error);
	}
}

export const workerTerminate = () => {
	try {
		workerValidator();
		const wrkr = get(blwWorker) as Worker;
		wrkr?.terminate();
	} catch (error) {
		debugError(error);
	}
}