

import { debug, debugError } from "$lib/core/utils/debug";
import { Env } from "$lib/core/utils/env";
import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";

const unlockWallet = async (accessToken: string, suid: string) => {
    let vault;
    try {
        // if (get(ENV) === Env.LOCAL) return;
        const response = await fetch('/api/unlockWallet', {
            method: 'POST',
            body: JSON.stringify({ suid, accessToken }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const res = await response.json();
        debug('Response', res);
        if(res?.response?.code !== 200) throw new Error('Error unlocking wallet');
        vault = res?.response?.v;
    } catch (error) {
        debugError('Error', error);
        window.alert('Sorry, there was an error unlocking the wallet.');
    }
    return vault;
}

export default unlockWallet;