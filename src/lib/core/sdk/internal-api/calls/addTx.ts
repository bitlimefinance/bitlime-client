import { debug, debugError } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { readSessionStorage } from "$lib/core/utils/localStorage";
import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";

const addTx = async (wallet: string, hash: string) => {
	try {
		const session_id = readSessionStorage('session_id') || '';
		const response = await fetch('/api/addTx', {
			method: 'POST',
			body: JSON.stringify({ wallet, hash, session_id}),
			headers: {
			'content-type': 'application/json'
			}
		});
		const res = await response.json();
		debug('Response', res);
		if(res?.response?.code !== 200) throw new Error('Error adding transaction');	
	} catch (error) {
		debugError(error);
	}
}

export default addTx;