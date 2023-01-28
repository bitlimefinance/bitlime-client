

export const prerender = false;

import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  try {
    const key = process.env.B_KEY;   
    const { vault, suid, accessToken } = await request.json();
    const res = await fetch(getBaseWfEndpoint()+'create-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        vault,
        suid: suid || 'null',
        accessToken
      })
    });

    return json(await res.json());
  } catch (error) {
    return json(error);
  }
}