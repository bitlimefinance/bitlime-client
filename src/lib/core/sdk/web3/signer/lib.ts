import { debugError } from "$lib/core/utils/debug";
import { Signer } from "ethers";
import { setProvider, web3Provider } from "../provider/lib";



export const getSigner = async (provider?: any) => {
    try {
        if(!provider) await setProvider();
        const prov = provider || web3Provider;
        const signer = await prov.getSigner();
        if (Signer.isSigner(signer)) return signer;
        else return null;
    } catch (error) {
        debugError(error);
        return null;
    }
};