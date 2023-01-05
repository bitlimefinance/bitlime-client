import { browser } from '$app/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (...args: any[]) => {
	if (browser) {
		console.log(...args);
	}
};

export const debugError = (...args: any[]) => {
	if (browser) {
		console.error(...args);
	}
};

export const debugWarn = (...args: any[]) => {
	if (browser) {
		console.warn(...args);
	}
};