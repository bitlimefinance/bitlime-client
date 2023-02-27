import { debugError } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { ENV } from "$lib/stores/envVars";
import { writable, get } from "svelte/store";
import { Action, type ToWorkerMessage } from "./types";
import { workerLoaded } from "../stores";

export const blwWorker = writable();

export const loadWorker = async () => {
	try {
		const SyncWorker = await import('./blw.worker');
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
		const wrkr = get(blwWorker) as Worker;
		if (!wrkr) throw new Error('Worker not found');
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

export const workerResolveMessage = async (message: ToWorkerMessage): Promise<any> => {
    try {
        workerPostMessage(message);
        return new Promise((resolve, reject) => {
            const worker = get(blwWorker) as Worker;
        
            worker.onmessage = (event) => {
                resolve(event.data);
            };
        
            worker.onerror = (error) => {
                reject(error);
            };
        });          
    } catch (error) {
        debugError(error);
        return;
    }
}

export const getSignerBlw = async () => {
	try {
		const message = {
			action: Action.GET_SIGNER
		};
		const response = await workerResolveMessage(message);
		if (response?.error || !response?.payload?.signer) throw new Error('Signer not found');
		return JSON.parse(response.payload.signer);
	} catch (error) {
		debugError(error);
		return;
	}
}