import { debug, debugError } from "$lib/core/utils/debug";
import { readSessionStorage } from "$lib/core/utils/localStorage";

const getTxHistory = async (wallet: string, until: number) => {
	const session_id = readSessionStorage('session_id') || '';
	const response = await fetch('/api/getTxHistory', {
		method: 'POST',
		body: JSON.stringify({ wallet, until, session_id}),
		headers: {
		'content-type': 'application/json'
		}
	});
	const res = await response.json();
	if(res?.response?.code == 200 && res?.response?.results) return res.response.results;
	else {
		debugError(res)
		return;
	};
}

export default getTxHistory;