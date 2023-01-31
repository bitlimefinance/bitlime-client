

export enum Action {
    CREATE = 'create',
    UNLOCK = 'unlock',
    IMPORT = 'import',
    ERROR = 'error',
    SEND_TRANSACTION = 'send',
    SM_READ = 'read',
    SM_WRITE = 'write',
    SM_INTERACT = 'interact',
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