

export enum Action {
    CREATE = 'create',
    UNLOCK = 'unlock',
    IMPORT = 'import',
    ERROR = 'error',
    SEND_TRANSACTION = 'send',
    TX_PREVIEW = 'preview',
    SM_READ = 'read',
    SM_WRITE = 'write',
    CONTRACT_INTERACT = 'interact',
    GET_ADDRESS = 'getAddress',
    GET_SIGNER = 'getSigner',
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
    contractInfo?: {
        abi: any[];
        address: string;
    };
    from?: string;
    value?: string;
    estimatedGas?: string;
    data?: string;
    nonce?: string;
    chainId: string;
}