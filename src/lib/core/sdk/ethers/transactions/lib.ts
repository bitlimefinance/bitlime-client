import { debugError, debug } from "$lib/core/utils/debug";
import { ethers } from "ethers";

export const sendTransaction = async (args: { toAddress: string, amount: string }) => {
    try {
        const toAddress = args.toAddress;
        const amount = args.amount || '0';

        txPreflight(true, [toAddress]);

        // get signer
        const signer = await getSigner() as Signer;

        // Set the amount to send in wei
        const weiAmount = ethers.utils.parseEther(amount);

        // Create and sign the transaction
        const tx = await signer.sendTransaction({
            to: toAddress,
            value: weiAmount
        });

        // Wait for the transaction to be mined
        await tx.wait();

        debug(`Transaction mined: ${tx.hash}`);

        return tx;
    } catch (error) {
        debugError(error);
        return null;
    }
}