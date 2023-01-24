

import { debug } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { readSessionStorage } from "$lib/core/utils/localStorage";
import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";

const createWallet = async (vault: string, pk: string) => {
    const suid = readSessionStorage('session_id') || ''; // session_id
    // if (get(ENV) === Env.LOCAL) return;
    const response = await fetch('/api/createWallet', {
        method: 'POST',
        body: JSON.stringify({ vault, suid, pk }),
        headers: {
            'content-type': 'application/json'
        }
    });
    debug('Response', response);
}

export default createWallet;