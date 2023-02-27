import { Signer } from "ethers";
import { setProvider, web3Provider } from "../provider/lib";
import { getSigner } from "../signer/lib";
import { validateAddresses } from "../utils/addresses/lib";
import { get } from "svelte/store";
import { selectedNetwork } from "$lib/stores/application";
import { debug } from "$lib/core/utils/debug";


export const txPreflight = async (requireSigner?: boolean, addressesToCheck?: string[]) => {
    // debug('txPreflight Network', get(selectedNetwork));
    if (!web3Provider) await setProvider(get(selectedNetwork)?.rpc);
    if (requireSigner) {
        const signer = await getSigner();
        if (!Signer.isSigner(signer)) throw new Error('Signer not set');
    }
    if (addressesToCheck) {
        if (!await validateAddresses(addressesToCheck)) throw new Error('Invalid address');
    };
};