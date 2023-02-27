import { debug } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { readSessionStorage } from "$lib/core/utils/localStorage";
import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";

const createLog = async (record: Object, schema?: string) => {
	let response: any;
	const session_id = readSessionStorage('session_id') || '';
	if(get(ENV)!==Env.LOCAL){
		response = await fetch('/api/record', {
			method: 'POST',
			body: JSON.stringify({ record, schema, session_id}),
			headers: {
			'content-type': 'application/json'
			}
		});
		debug('Response', response);
	}
	debug('Record', record);
}

export default createLog;