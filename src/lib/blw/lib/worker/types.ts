

export enum Action {
    INIT = 'init',
    SEND = 'send',
    GET_ADDRESS = 'getAddress',
}

export interface ToWorkerMessage {
    action: Action;
    payload?: {
        [key: string]: any;
    };
}