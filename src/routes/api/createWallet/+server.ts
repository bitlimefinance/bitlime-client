

export const prerender = false;

import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  let res: any;
  const key = process.env.B_KEY;   
  const { vault, suid, pk } = await request.json();
  await fetch(getBaseWfEndpoint()+'create-wallet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      vault,
      suid: suid || 'null',
      pk
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