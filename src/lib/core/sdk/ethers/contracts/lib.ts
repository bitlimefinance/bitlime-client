
export const interactWithContract = async (args: { address: string, abi: any, methodName: string, methodParams: any[], value?: string }) => {
    try {
        const { address, abi, methodName, methodParams } = args;
        const value = args.value || '0';

        txPreflight(true, [address]);

        // get signer
        const signer = await getSigner() as Signer;

        // Connect to the contract
        const contract = new ethers.Contract(address, abi, signer);

        // Estimate the gas needed for the transaction
        const gasEstimate = await contract.estimateGas[methodName](...methodParams);
        debug(`Gas estimate: ${gasEstimate.toString()}`);

        // Prepare the contract function call
        const tx = await contract.functions[methodName](...methodParams, {
            value,
            gasLimit: gasEstimate
        });

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
    methodParams: Array<any>,
}) => {
    let result;
    try {
        txPreflight(false, [args.address]);
        let contract = await loadContractReadOnly(args.abi, args.address);
        result = await contract.functions[args.methodName](...args.methodParams);
    } catch (error) {
        debugError(error);
    } finally {
        return result;
    }
}

export const loadContractReadOnly = async (abi: any, address: string) => {
    txPreflight(false, [address]);
    return new ethers.Contract(address, abi).connect(web3Provider);
}

export const loadContract = async (abi: any, address: string) => {
    txPreflight(true, [address]);

    // get signer
    const signer = await getSigner() as Signer;

    return new ethers.Contract(address, abi, signer);
}
