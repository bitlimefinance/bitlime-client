import { browser } from '$app/environment';

// Simple interface over retrieving (but not modifying) values from localStorage.
// Can be used for STRING values by itself or in READABLE stores.
// Will not handle type conversion, nor writable stores.
// Please feel free to add functionality to support those scenarios or to make this more robust.
// Suggestion would be for a "readWriteLocalStorage" method to handle writable stores.
export const readLocalStorage = (key: string, defaultValue?: string) => {
	if (!browser) return defaultValue;

	let value = localStorage.getItem(key);

	if (value === null) {
		try {
			if (defaultValue) {
				localStorage.setItem(key, defaultValue);
			}
		} catch (_e) {
			// OOM or localStorage disabled
		} finally {
			value = defaultValue || null;
		}
	}

	return value;
};

export const writeLocalStorage = (key: string, value: string) => {
	if (!browser) return;

	try {
		localStorage.setItem(key, value);
	} catch (e) {
		// OOM or localStorage disabled
		// Do nothing
	}
};

export const readSessionStorage = (key: string, defaultValue?: string) => {
	if (!browser) return defaultValue;

	let value = sessionStorage.getItem(key);

	if (value === null) {
		try {
			if (defaultValue) {
				sessionStorage.setItem(key, defaultValue);
			}
		} catch (_e) {
			// OOM or sessionStorage disabled
		} finally {
			value = defaultValue || null;
		}
	}

	return value;
};

export const writeSessionStorage = (key: string, value: string) => {
	if (!browser) return;

	try {
		sessionStorage.setItem(key, value);
	} catch (e) {
		// OOM or localStorage disabled
		// Do nothing
	}
};




type LocalStorageSubscription = (value: string | null | undefined) => void;

// Implements the Svelte store contract (https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract)
// so this can be used to create a store which is initially populated from localStorage and then
// stored on writes.
//
// Note: If no defaultValue is provided and this is run on the server, the store's value will
// be undefined. Otherwise, if no localStorage exists for the key and no defaultValue is provided,
// the store's value will be null.
export const persisted = (key: string, defaultValue?: string) => {
	const subs: LocalStorageSubscription[] = [];

	return {
		subscribe(subscription: LocalStorageSubscription) {
			subscription(readLocalStorage(key, defaultValue));
			subs.push(subscription);
			return () => {
				subs.splice(subs.indexOf(subscription), 1);
			};
		},
		set(value: string) {
			writeLocalStorage(key, value);
			subs.forEach((sub) => sub(value));
		},
		remove() {
			localStorage.removeItem(key);
			subs.forEach((sub) => sub(null));
		}
	};
};