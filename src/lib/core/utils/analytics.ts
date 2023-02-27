import { UAParser } from 'ua-parser-js'; 
import { browser as isBrowser } from '$app/environment';
import { readLocalStorage, readSessionStorage } from './localStorage';
import { debug } from './debug';
import { Env, getEnv } from './env';
import createLog from '../sdk/internal-api/calls/createLog';
import { get } from 'svelte/store';
import { ipStore } from '$lib/stores/analytics';

const getBrowserDataRecorder = () => {
	const uaParser = new UAParser(window.navigator.userAgent);
	const { browser, cpu, device, engine, os, ua } = uaParser.getResult();
	const uuid = readLocalStorage('user_uuid', window.crypto.randomUUID());
	const sessionId = readSessionStorage('session_id', window.crypto.randomUUID());
    const getIp = async () => {
		try{
			let fromStore = get(ipStore);
			if(fromStore) return fromStore;
			else return (
				await fetch('/api/getIp')
				.then((res) => res.json())
				.then((data) => {
					return data.ip;
				})
				.catch((err) => {
					console.error(err);
					return '';
				}));
		} catch (e) {
			console.error(e);
			return '';
		}
	};

	const userDevice = {
		ua_string: ua,
		browser_name: browser.name,
		browser_version: browser.version,
		browser_engine: engine.name,
		browser_language: navigator.language,
		cpu_arch: cpu.architecture,
		device_type: device.type,
		device_model: device.model,
		device_vendor: device.vendor,
		os_name: os.name,
		os_version: os.version,
		inner_width: window?.innerWidth,
		inner_height: window?.innerHeight
	};

	return async (event: string, data: Object) => {
		const record = {
			context: getEnv(),
			event: event,
			session_id: 'sid-' + sessionId,
			user_uuid: uuid,
			user_ip: await getIp(),
			...userDevice,
			// Unsure about any edge-cases where this wouldn't match the href from the
			// Svelte router. Keep an eye out for data points in a user's timeline where the url
			// is different than what the last navigation data point recorded. We should be able to
			// determine the url of any data-point captured in between navigation events by looking at
			// the closest preceding navigation event.
			url: window.location.href,
			timestamp: new Date(),
			...data
		};		

		createLog(record);
	};
};

const recordData = isBrowser ? getBrowserDataRecorder() : () => Promise.resolve();

export { recordData };
