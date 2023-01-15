import { validateAddresses } from "../utils/addresses/lib";


export const txPreflight = async (requireSigner?: boolean, addressesToCheck?: string[]) => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    if (requireSigner) {
        const signer = await getSigner();
        if (!Signer.isSigner(signer)) throw new Error('Signer not set');
    }
    if (addressesToCheck) {
        if (!await validateAddresses(addressesToCheck)) throw new Error('Invalid address');
    };
};