

import { debug, debugError } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { readSessionStorage } from "$lib/core/utils/localStorage";
import { ENV } from "$lib/stores/envVars";
import { json } from "@sveltejs/kit";
import { get } from "svelte/store";

const createWallet = async (vault: string, pk: string) => {
    try {
        const suid = readSessionStorage('session_id') || ''; // session_id
        // if (get(ENV) === Env.LOCAL) return;
        const response = await fetch('/api/createWallet', {
            method: 'POST',
            body: JSON.stringify({ vault, suid, pk }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const res = await response.json();
        debug('Response', res);
        if(res?.response?.code !== 200) throw new Error('Error creating wallet');
    } catch (error) {
        debugError('Error', error);
        window.alert('Sorry, there was an error creating the wallet.');
    }
}

export default createWallet;