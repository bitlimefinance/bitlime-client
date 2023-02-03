import { Signer } from "ethers";
import { setProvider, web3Provider } from "../provider/lib";
import { getSigner } from "../signer/lib";
import { validateAddresses } from "../utils/addresses/lib";
import { get } from "svelte/store";
import { selectedNetwork } from "$lib/stores/application";


export const txPreflight = async (requireSigner?: boolean, addressesToCheck?: string[]) => {
    if (!web3Provider) await setProvider(get(selectedNetwork)?.rpc);
    if (requireSigner) {
        const signer = await getSigner();
        if (!Signer.isSigner(signer)) throw new Error('Signer not set');
    }
    if (addressesToCheck) {
        if (!await validateAddresses(addressesToCheck)) throw new Error('Invalid address');
    };
};