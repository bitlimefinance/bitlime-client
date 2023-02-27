import { readSessionStorage } from "$lib/core/utils/localStorage";

const getTokens = async (symbols?: string[]) => {
	let response: any;
	const session_id = readSessionStorage('session_id') || '';
	response = await fetch('/api/getTokens', {
		method: 'POST',
		body: JSON.stringify({ symbols: symbols || [], session_id }),
		headers: {
		'content-type': 'application/json'
		}
	});
	return await response.json();
}

export default getTokens;