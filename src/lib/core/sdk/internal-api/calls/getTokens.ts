
const getTokens = async (symbols?: string[]) => {
	let response: any;
	response = await fetch('/api/getTokens', {
		method: 'POST',
		body: JSON.stringify({ symbols: symbols || [] }),
		headers: {
		'content-type': 'application/json'
		}
	});
	return await response.json();
}

export default getTokens;