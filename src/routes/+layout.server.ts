import { ENV } from "$env/static/private";
import { Env } from "$lib/core/utils/env";

 
/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {
        envVars: {
            EMV: ENV || Env.LOCAL
        }
    };
  }

/*

!!! IMPORTANT: Do not return any sensitive information from this function otherwise it will be exposed to the client. !!!

*/