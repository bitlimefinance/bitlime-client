import { globals } from 'svelte/internal';
import { debugError } from '../debug';
import { base64ToBuffer, bufferToBase64 } from './passworder';

export const toHash = async (data: string, options: {
    algo?: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
} = {}) => {
    try {        
        const { crypto } = globals;
        const { algo } = options;
        const hash = await crypto.subtle.digest(algo || 'SHA-256', base64ToBuffer(data));
        return bufferToBase64(hash);
    } catch (error) {
        debugError(error);
        return;
    }
};

// "SHA-1" (but don't use this in cryptographic applications)
// "SHA-256"
// "SHA-384"
// "SHA-512"
