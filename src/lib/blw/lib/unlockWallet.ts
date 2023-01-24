

import { debug } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { readSessionStorage } from "$lib/core/utils/localStorage";
import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";

const unlockWallet = async (enc_psw: string, enc_address: string) => {
    const suid = readSessionStorage('session_id') || ''; // session_id
    // if (get(ENV) === Env.LOCAL) return;
    const response = await fetch('/api/unlockWallet', {
        method: 'POST',
        body: JSON.stringify({ suid, enc_psw, enc_address }),
        headers: {
            'content-type': 'application/json'
        }
    });
    debug('Response', response);
}

export default unlockWallet;