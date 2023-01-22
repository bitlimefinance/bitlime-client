import { debugError } from "$lib/core/utils/debug";
import { Wallet, ethers } from "ethers";


export const newWallet = (locale?: string) => {
    try {
        const wallet = Wallet.createRandom({
            extraEntropy: ethers.utils.randomBytes(16),
            locale
        });
        return wallet;
    } catch (error) {
        debugError(error);
        return null;
    }
}