import { debugError } from "$lib/core/utils/debug";
import { Signer } from "ethers";
import { web3Provider } from "../provider/lib";



export const getSigner = async (provider: any = web3Provider) => {
    try {
        const signer = await provider.getSigner();
        if (Signer.isSigner(signer)) return signer;
        else return null;
    } catch (error) {
        debugError(error);
        return null;
    }
};