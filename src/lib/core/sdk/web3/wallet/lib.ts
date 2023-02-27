import { debugError } from "$lib/core/utils/debug";
import { Wallet, ethers } from "ethers";


export const newWallet = async (locale?: string) => {
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

export const fromEncryptedJson = async (json: string, password: string) => {
    try {
        const wallet = await Wallet.fromEncryptedJson(json, password);
        return wallet;
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const fromEncryptedJsonSync = (json: string, password: string) => {
    try {
        const wallet = Wallet.fromEncryptedJsonSync(json, password);
        return wallet;
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const fromMnemonic = async (mnemonic: string) => {
    try {
        const wallet = Wallet.fromMnemonic(mnemonic);
        return wallet;
    } catch (error) {
        debugError(error);
        return null;
    }
}

