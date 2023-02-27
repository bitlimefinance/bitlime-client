import { debugError } from "$lib/core/utils/debug";
import { ethers, type BigNumberish } from "ethers";



export const toBigNumber = (amount: BigNumberish) => {
    try {
        return ethers.BigNumber.from(amount);
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const fromBigNumber = (amount: BigNumberish) => {
    try {
        return ethers.BigNumber.from(amount).toString();
    } catch (error) {
        debugError(error);
        return null;
    }
}