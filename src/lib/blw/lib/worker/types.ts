

export enum Action {
    CREATE = 'create',
    UNLOCK = 'unlock',
    IMPORT = 'import',
    ERROR = 'error',
    SEND_TRANSACTION = 'send',
    SMART_CONTRACT_INTERACT = 'interact',
    GET_ADDRESS = 'getAddress',
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