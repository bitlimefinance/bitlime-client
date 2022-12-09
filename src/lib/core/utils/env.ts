

export enum Env {
	PROD = 'prod',
    NIGHTLY = 'nightly',
	DEV = 'dev',
	LOCAL = 'local'
}

export const getEnv = () => {
	try {
		return process?.env?.ENV || Env.LOCAL;
	} catch (error) {
		return Env.LOCAL;
	}
};
