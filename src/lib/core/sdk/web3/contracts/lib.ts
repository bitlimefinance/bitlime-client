import { debug, debugBreakpoint, debugError } from "$lib/core/utils/debug";
import { ethers, Signer } from "ethers";
import { web3Provider } from "../provider/lib";
import { getSigner } from "../signer/lib";
import { txPreflight } from "../transactions/txPreflight";

export const interactWithContract = async (args: { address: string, abi: any, methodName: string, methodParams: any[], value?: string }) => {
    try {
        const { address, abi, methodName, methodParams } = args;
        const value = args.value || '0';
        debugBreakpoint(`Interacting with contract ${address} with method ${methodName} and params:`);
        debug(args);
        txPreflight(true, [address]);

        debugBreakpoint('Get signer');
        // get signer
        const signer = await getSigner() as Signer;

        debugBreakpoint('Connect to contract');
        // Connect to the contract
        const contract = new ethers.Contract(address, abi, signer);

        debugBreakpoint('Estimate gas');
        // Estimate the gas needed for the transaction
        const gasEstimate = await contract.estimateGas[methodName](...methodParams);
        debugBreakpoint('Gas estimated: ' + gasEstimate.toString());

        // Prepare the contract function call
        const tx = await contract.functions[methodName](...methodParams, {
            value,
            gasLimit: gasEstimate
        });
        debugBreakpoint('Tx sent');

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        debug(`Transaction mined: ${tx.hash}`);
        debug(`Gas used: ${receipt.gasUsed.toString()}`);
        return { tx, receipt };
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const readSmartContract = async (args: {
    abi: any[],
    address: string,
    methodName: string,
    methodParams: any[],
}) => {
    let result;
    try {
        debug(args.methodName,args);
        txPreflight(false, [args.address]);
        const contract = await loadContractReadOnly(args.abi, args.address);
        result = await contract.functions[args.methodName](...args.methodParams);
        return result;
    } catch (error) {
        debugError(error);
    }
}

export const loadContractReadOnly = async (abi: any[], address: string) => {
    txPreflight(false, [address]);
    return new ethers.Contract(address, abi, web3Provider);
}

export const loadContract = async (abi: any[], address: string) => {
    txPreflight(true, [address]);

    // get signer
    const signer = await getSigner() as Signer;

    return new ethers.Contract(address, abi, signer);
}
