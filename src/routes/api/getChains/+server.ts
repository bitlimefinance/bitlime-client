

export const prerender = false;

import { getBaseWfEndpoint } from '$lib/core/sdk/internal-api/utils';
import { json } from '@sveltejs/kit';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({request}: {request: any}) {
  
  return 'Endopoint not enabled';

  // let res: any;
  // const key = process.env.B_KEY;
  // const { chainId } = await request.json();
  // await fetch(getBaseWfEndpoint()+'chains-list?'+'chain_id='+JSON.stringify(chainId), {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${key}`,
  //   }
  // })
  // .then(response => response.json())
  // .then(data => {
  //   res = data;
  // })
  // .catch((error) => {
  //   res = error;
  // });
  // return json(res);
}