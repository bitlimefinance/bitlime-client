

export const prerender = false;

import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  let res: any;
  const key = process.env.B_KEY;   
  const { record, schema, session_id } = await request.json();
  await fetch(getBaseWfEndpoint()+'record-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      data: JSON.stringify(record),
      schemaId: schema || 'schema-1',
      suid: session_id || 'null'
    })
  })
  .then(response => response.json())
  .then(data => {
    res = data;
  })
  .catch((error) => {
    res = error;
  });
  return json(res);
}