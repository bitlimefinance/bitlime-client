import { browser } from '$app/environment';
import { ENV } from '$lib/stores/envVars';
import { get } from 'svelte/store';
import { Env } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (...args: any[]) => {
	if (browser && get(ENV)===Env.LOCAL) {
		console.log(...args);
	}
};

export const debugError = (...args: any[]) => {
	if (browser && get(ENV)===Env.LOCAL) {
		console.error(...args);
	}
};

export const debugWarn = (...args: any[]) => {
	if (browser && get(ENV)===Env.LOCAL) {
		console.warn(...args);
	}
};

export const debugTime = (log: string) => {
	if (browser && get(ENV)===Env.LOCAL) {
		console.log(log);
		console.time(log);
	}
}

export const debugTimeEnd = (log: string) => {
	if (browser && get(ENV)===Env.LOCAL) {
		console.timeEnd(log);
	}
}