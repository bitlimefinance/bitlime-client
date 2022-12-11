import { Env, getEnv } from "$lib/core/utils/env";

export enum BaseEndpoints {
    WF_TEST = 'https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/version-test/api/1.1/wf/',
    WF_PROD = 'https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/api/1.1/wf/',
    DATA_TEST = 'https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/version-test/api/1.1/obj',
    DATA_PROD = 'https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/api/1.1/obj'
}

export const getBaseDataEndpoint = () => {
    try {
        return getEnv() === Env.PROD || getEnv() === Env.NIGHTLY ? BaseEndpoints.DATA_PROD : BaseEndpoints.DATA_TEST;
    } catch (error) {
        console.error(error);
        return BaseEndpoints.DATA_TEST;
    }
}

export const getBaseWfEndpoint = () => {
    try {
        return getEnv() === Env.PROD || getEnv() === Env.NIGHTLY ? BaseEndpoints.WF_PROD : BaseEndpoints.WF_TEST;
    } catch (error) {
        console.error(error);
        return BaseEndpoints.WF_TEST;
    }
}