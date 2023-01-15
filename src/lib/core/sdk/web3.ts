
import { BigNumber, ethers, Signer } from "ethers";
import type { EtherUnit } from "../descriptors/types";
import { writable } from "svelte/store";
import { debug, debugError } from "../utils/debug";

export const web3Ready_ = writable(false);

export const ADDRESS_0: Readonly<string> = "0x0000000000000000000000000000000000000000";

export let web3Provider: any;

export const loadWeb3 = async (rpc?: string) => {
    try {
        if(window.ethereum) web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        else web3Provider = new ethers.providers.JsonRpcProvider(rpc || window.bl_rpc || 'https://rpc.ankr.com/eth');
        web3Ready_.set(true);
    } catch (error) {
        debugError(error);
    }
}

export const getSigner = async (provider: any = web3Provider) => {
    try {
        const signer = await provider.getSigner();
        if(Signer.isSigner(signer)) return signer;
        else return null;
    } catch (error) {
        debugError(error);
        return null;
    }
};

export const isAddress = async (address: string) => {
    try {
        return ethers.utils.isAddress(address);
    } catch (error) {
        debugError(error);
        return false;
    }
}

export const validateAddresses = async (addresses: Array<string>) => {
    try{
        let valid: boolean = true;
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            if (!await isAddress(address)) {
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

export const txPreflight = async (requireSigner?: boolean, addressesToCheck?: string[]) => {
    if (!web3Provider) await loadWeb3(window.bl_rpc);
    if(requireSigner){
        const signer = await getSigner();
        if (!Signer.isSigner(signer)) throw new Error('Signer not set');
    }
    if(addressesToCheck) {
        if(!await validateAddresses(addressesToCheck)) throw new Error('Invalid address');
    };
};


export const interactWithContract = async (args: {address: string, abi: any, methodName: string, methodParams: any[], value?: string}) => {
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
        return { tx, receipt};
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const sendTransaction = async (args:{toAddress: string, amount: string}) => {
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

export const getAddressPreview = (address: string) => {
    if (!address) return;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export const getBalance = async (address: string) => {
    txPreflight(false, [address]);
    let res = await web3Provider.getBalance(address);
    return res;
}

export const noOfDecimalsToUnits = (decimals: number = 18) => {
    let decimalsString = decimals.toString();
    let unitMap: {
        [key: string]: Array<EtherUnit>
    } = {
        '0': ['noether'],
        '1': ['wei'],
        '3': ['kwei', 'Kwei', 'babbage', 'femtoether'],
        '6': ['mwei', 'Mwei', 'lovelace', 'picoether'],
        '9': ['gwei', 'Gwei', 'shannon', 'nanoether', 'nano'],
        '12': ['szabo', 'microether', 'micro'],
        '15': ['finney', 'milliether', 'milli'],
        '18': ['ether'],
        '21': ['kether', 'grand'],
        '24': ['mether'],
        '27': ['gether'],
        '30': ['tether']
    };
    
    if(unitMap[decimalsString]) return unitMap[decimalsString][0];
    else return null;
}

export const getGasPrice = async () => {
    txPreflight();
    const gas = await web3Provider.getGasPrice();
    return gas;
}

export const getLatestBlock = async () => {
    txPreflight();
    const gas = await web3Provider.getBlockNumber();
    return gas;
}


export const estimateGas = async (data: any, from: string, value: string) => {
    txPreflight();
    const gas = await web3Provider.estimateGas({ data, from, value, gasPrice: await getGasPrice() });
    return await gas.toString();
}

export const toWei = (amount: string, unit: EtherUnit | null) => {
    try {
        return ethers.utils.parseUnits(amount, unit || 'ether').toString(); // type: string | null
    } catch (error) {
        debugError(error);
        return null;  
    }
}

export const fromWei = (amount: string, unit: EtherUnit | null) => {
    try {
        return ethers.utils.formatUnits(amount, unit || 'ether'); // type: string | null
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const toBigNumber = (amount: string) => {
    try {
        return ethers.BigNumber.from(amount);
    } catch (error) {
        debugError(error);
        return null;  
    }
}

export const fromBigNumber = (amount: BigNumber) => {
    try {
        return ethers.BigNumber.from(amount).toString();
    } catch (error) {
        debugError(error);
        return null;  
    }
}