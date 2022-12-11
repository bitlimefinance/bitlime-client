

export const prerender = false;

import { B_KEY } from '$env/static/private';
import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  let res: any;
  try{
    const { record, schema } = await request.json();
    await fetch(getBaseWfEndpoint()+'record-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${B_KEY}`,
      },
      body: JSON.stringify({
        data: JSON.stringify(record),
        schemaId: schema || 'schema-1'
      })
    })
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch((error) => {
      res = error;
    })
  } catch (e) {
    res = e;
  }
  return json(res);
}