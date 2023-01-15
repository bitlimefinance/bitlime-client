
import { debugError } from "$lib/core/utils/debug";
import { web3Provider } from "../../provider/lib";
import { txPreflight } from "../../transactions/txPreflight";
import { isAddress } from "ethers/lib/utils";

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const validateAddresses = async (addresses: Array<string>) => {
    try {
        let valid = true;
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            if (!isAddress(address)) {
                valid = false;
                throw new Error(`Invalid address: ${address}`);
            }
        }
        return valid;
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const getAddressBalance = async (address: string) => {
    txPreflight(false, [address]);
    const res = await web3Provider.getBalance(address);
    return res;
}