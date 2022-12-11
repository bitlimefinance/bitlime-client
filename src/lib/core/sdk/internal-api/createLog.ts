import { debug } from "$lib/core/utils/debug";

const createLog = async (record: Object, schema?: string) => {
    const response = await fetch('/api/record', {
		method: 'POST',
		body: JSON.stringify({ record, schema }),
		headers: {
		  'content-type': 'application/json'
		}
	  });
  
	
	debug('Record', record);
	debug('Response', await response.json())
	
}

export default createLog;