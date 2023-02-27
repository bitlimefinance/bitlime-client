

export const prerender = false;

import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  try {
    const key = process.env.B_KEY;
    const { wallet, until, session_id } = await request.json();
    const res = await fetch(getBaseWfEndpoint()+'tx-history?'+'wallet='+JSON.stringify(wallet)+'&&until='+JSON.stringify(until)+'&&suid='+JSON.stringify(session_id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      }
    });
    
    return json(await res.json());
  } catch (error) {
    return json(error);
  }
}