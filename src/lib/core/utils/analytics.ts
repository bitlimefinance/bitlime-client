// import UAParser from 'ua-parser-js';
// import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
// import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
// import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
// import infraConfig from '$lib/config/infra.json';
// import { browser as isBrowser } from '$app/environment';
// import { readLocalStorage, readSessionStorage } from './localStorage';
// import { debug } from './debug';
// import { env } from './env';
// import { user } from './auth';
// import { get } from 'svelte/store';
// import { ip as ipStore } from '../../stores/store';

// const getBrowserDataRecorder = () => {
// 	const uaParser = new UAParser(window.navigator.userAgent);
// 	const { browser, cpu, device, engine, os, ua } = uaParser.getResult();
// 	const uuid = readLocalStorage('user_uuid', window.crypto.randomUUID());
// 	const sessionId = readSessionStorage('session_id', window.crypto.randomUUID());

// 	const awsRegion = 'us-east-1';

// 	const firehoseClient = new FirehoseClient({
// 		region: awsRegion,
// 		credentials: fromCognitoIdentityPool({
// 			client: new CognitoIdentityClient({ region: awsRegion }),
// 			identityPoolId: infraConfig.Cognito.IdentityPoolId
// 		})
// 	});

// 	const userDevice = {
// 		ua_string: ua,
// 		browser_name: browser.name,
// 		browser_version: browser.version,
// 		browser_engine: engine.name,
// 		browser_language: navigator.language,
// 		cpu_arch: cpu.architecture,
// 		device_type: device.type,
// 		device_model: device.model,
// 		device_vendor: device.vendor,
// 		os_name: os.name,
// 		os_version: os.version,
// 		inner_width: window?.innerWidth,
// 		inner_height: window?.innerHeight
// 	};

// 	const encoder = new TextEncoder();

// 	return async (data: Record<string, unknown>, currentTimeStamp: string) => {
// 		const record = {
// 			env,
// 			session_id: 'sid-' + sessionId,
// 			user_uuid: uuid,
// 			user_ip: get(ipStore),
// 			user_email: get(user).email,
// 			...userDevice,
// 			// Unsure about any edge-cases where this wouldn't match the href from the
// 			// Svelte router. Keep an eye out for data points in a user's timeline where the url
// 			// is different than what the last navigation data point recorded. We should be able to
// 			// determine the url of any data-point captured in between navigation events by looking at
// 			// the closest preceding navigation event.
// 			url: window.location.href,
// 			timestamp: currentTimeStamp ? currentTimeStamp : new Date().toISOString(),
// 			...data
// 		};

// 		if (env != 'prod' && window && window.debugAnalytics) debug('ANALYTICS', record);

// 		const command = new PutRecordCommand({
// 			DeliveryStreamName: infraConfig.AnalyticsDeliveryStream.DeliveryStreamName,
// 			Record: {
// 				Data: encoder.encode(JSON.stringify(record))
// 			}
// 		});

// 		return firehoseClient.send(command).catch(console.error);
// 	};
// };

// const recordData = isBrowser ? getBrowserDataRecorder() : () => Promise.resolve();

// export { recordData };
