
const getChains = async (chainId?: string[]) => {
	let response: any;
	response = await fetch('/api/getChains', {
		method: 'POST',
		body: JSON.stringify({ chainId: chainId || [] }),
		headers: {
		'content-type': 'application/json'
		}
	});
	return await response.json();
}

export default getChains;