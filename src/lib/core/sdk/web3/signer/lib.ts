import { debugError } from "$lib/core/utils/debug";
import { Signer } from "ethers";
import { setProvider, web3Provider } from "../provider/lib";
import { _WALLETS } from "$lib/globals";
import { connected } from "$lib/stores/application";
import { get } from "svelte/store";
import { workerResolveMessage } from "$lib/blw/lib/worker/workerApi";
import { Action } from "$lib/blw/lib/worker/types";

export const getSigner = async (provider?: any) => {
    try {
        if(!provider && !web3Provider) await setProvider();
        const prov = provider || web3Provider;
        const signer = await prov.getSigner();
        if (Signer.isSigner(signer)) return signer;
        else return null;
    } catch (error) {
        debugError(error);
        return null;
    }
};