import { readSessionStorage } from "$lib/core/utils/localStorage";

const getChains = async (chainId?: string[]) => {
	let response: any;
	const session_id = readSessionStorage('session_id') || '';
	response = await fetch('/api/getChains', {
		method: 'POST',
		body: JSON.stringify({ chainId: chainId || [], session_id }),
		headers: {
		'content-type': 'application/json'
		}
	});
	return await response.json();
}

export default getChains;