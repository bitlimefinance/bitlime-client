import { getBaseWfEndpoint } from "$lib/core/sdk/internal-api/utils";
import { Env } from "$lib/core/utils/env";

 
/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    const key = process.env.B_KEY;

    let chains: any;
    let tokens: any;

    await fetch(getBaseWfEndpoint()+'chains-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        }
    })
    .then(async response => chains = await response.json())
    .catch(() => {
        chains = null;
    });

    await fetch(getBaseWfEndpoint()+'tokens-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        }
    })
    .then(async response => tokens = await response.json())
    .catch(() => {
        tokens = null;
    });

    return {
        env: process.env.ENV || Env.LOCAL,
        chainsList: chains,
        tokensList: tokens
    };
  }

/*

!!! IMPORTANT: Do not return any sensitive information from this function otherwise it will be exposed to the client. !!!

*/