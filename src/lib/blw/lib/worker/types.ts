import type { BigNumber, BigNumberish } from "ethers";


export enum Action {
    CREATE = 'create',
    UNLOCK = 'unlock',
    IMPORT = 'import',
    ERROR = 'error',
    TX_SEND = 'sendTx',
    TX_PREVIEW = 'previewTx',
    SM_READ = 'read',
    SM_WRITE = 'write',
    CONTRACT_INTERACT = 'interact',
    GET_ADDRESS = 'getAddress',
    GET_SIGNER = 'getSigner',
    ESTIMATE_GAS = 'gasEstimate'
}

export interface ToWorkerMessage {
    action: Action;
    payload?: {
        [key: string]: any;
    };
}

export interface FromWorkerMessage {
    action: Action;
    error: boolean;
    payload?: {
        [key: string]: any;
    };
}

export interface TxInfo {
    to: string;
    methodName: string;
    methodParams: any[];
    contractInfo?: {
        abi: any[];
        address: string;
    };
    from?: string;
    value?: string;
    estimatedGas?: BigNumber | BigNumberish;
    data?: string;
    nonce?: string;
    errorMessage?: string;
    chainId: string;
}