import { ENV } from "$lib/stores/envVars";
import { get } from "svelte/store";


export enum Env {
	PROD = 'prod',
    NIGHTLY = 'nightly',
	DEV = 'dev',
	LOCAL = 'local'
}

export const getEnv = () => {
	try {
		return get(ENV) || Env.LOCAL;
	} catch (error) {
		return Env.LOCAL;
	}
};
