import { toHash } from "$lib/core/utils/cipher/crypto";
import { debugError } from "$lib/core/utils/debug";
import { readLocalStorage } from "$lib/core/utils/localStorage";


export const deriveAccessTokenPair = async (password: string, pk: string): Promise<{
    partialAccessToken: string;
    accessToken: string;
}> => {
    try {
        const slt = readLocalStorage('bl-slt') || '';
        const hasedPassword = await toHash(password);
        if(!hasedPassword || !pk || !slt || !password) throw new Error('Could not derive access token pair');
        const partialAccessToken = await toHash(pk + hasedPassword + slt);
        const accessToken = await toHash(partialAccessToken + hasedPassword + slt);
        if(!partialAccessToken || !accessToken) throw new Error('Could not derive access token pair');
        return { partialAccessToken, accessToken };
    } catch (error) {
        debugError(error);
        return { partialAccessToken: '', accessToken: '' };
    }
}

export const deriveAccessTokenFromPartial = async (password: string, partialAccessToken: string): Promise<string | undefined> => {
    try {
        const slt = readLocalStorage('bl-slt') || '';
        const hasedPassword = await toHash(password);
        if(!hasedPassword || !partialAccessToken || !slt || !password) throw new Error('Could not derive access token');
        const accessToken = await toHash(partialAccessToken + hasedPassword + slt);
        if(!accessToken) throw new Error('Could not derive access token');
        return accessToken;
    } catch (error) {
        debugError(error);
        return;
    }
}