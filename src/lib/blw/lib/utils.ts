import { toHash } from "$lib/core/utils/cipher/crypto";
import { bufferToBase64 } from "$lib/core/utils/cipher/passworder";
import { debugError } from "$lib/core/utils/debug";
import { readLocalStorage, writeLocalStorage } from "$lib/core/utils/localStorage";
import { randomBytes } from "ethers/lib/utils";
import { workerPostMessage, workerResolveMessage } from "./worker/workerApi";
import { Action } from "./worker/types";
import { blwWorker } from "./worker/workerApi";
import { get } from "svelte/store";


export const getEncPartialAccessToken = async (): Promise<string> => {
    try {
        const partialAccessToken = readLocalStorage('blw-pk');
        if(!partialAccessToken) throw new Error('Could not get partial access token');
        return partialAccessToken;
    } catch (error) {
        debugError(error);
        return '';
    }
}

export const writePartialAccessToken = async (value: string): Promise<void> => {writeLocalStorage('blw-pk', value)};


export const createAccessTokenPair = async (password: string, pk: string): Promise<{
    partialAccessToken: string;
    accessToken: string;
}> => {
    try {
        const slt = bufferToBase64(randomBytes(8));
        const hasedPassword = await toHash(password);
        if(!hasedPassword || !pk || !slt || !password) throw new Error('Could not derive access token pair');
        const partialAccessToken = await toHash(pk + hasedPassword + slt);
        console.log('partialAccessToken', partialAccessToken+slt);
        
        const accessToken = await toHash(partialAccessToken + hasedPassword);
        if(!partialAccessToken || !accessToken) throw new Error('Could not derive access token pair');
        return { partialAccessToken, accessToken };
    } catch (error) {
        debugError(error);
        return { partialAccessToken: '', accessToken: '' };
    }
}

export const deriveAccessTokenFromPartial = async (password: string, partialAccessToken?: string): Promise<string | undefined> => {
    try {
        const pat = partialAccessToken || await getEncPartialAccessToken();
        const hasedPassword = await toHash(password);
        if(!hasedPassword || !pat || !password) throw new Error('Could not derive access token');
        const accessToken = await toHash(pat + hasedPassword);
        if(!accessToken) throw new Error('Could not derive access token');
        return accessToken;
    } catch (error) {
        debugError(error);
        return;
    }
}