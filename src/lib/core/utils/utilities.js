import { _messages } from "../../globals";
// import { recordData } from "./analytics";

export function sluggify(text, lowercase=true) {
	if (!text) {
		return '';
	}
	if (lowercase) {
		return text.trim().toLowerCase().replace(/\s/g, '');
	}else{
		return text.trim().replace(/\s/g, '');
	}
}

export function camelCase(text='') {
	let str = text
		.trim()
		.toLowerCase()
		.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
	str = str.replace(/\s/g, '');
	if (str) {
		return str[0].toLowerCase() + str.slice(1);
	}else{
		return '';
	}
}

export const navigate = (destination) => {
	window.location = destination;
};

export function removeAllChildNodes(parent) {
	try{
		while (parent && parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}catch(e){
		console.error(e)
	}
}

export const arrayIsSubset = (arraySubset, array) => {
	let checker = (arr, target) => target.every(v => arr.includes(v));
	let result = false;
	try {
		result = checker(array, arraySubset);
	} catch (error) {
		console.error(error);
	}
	return result;
}

export function areArraysEqualSets(array1, array2) {
	const superSet = {};
	for (const i of array1) {
		const e = i + typeof i;
		superSet[e] = 1;
	}

	for (const i of array2) {
		const e = i + typeof i;
		if (!superSet[e]) {
			return false;
		}
		superSet[e] = 2;
	}

	for (let e in superSet) {
		if (superSet[e] === 1) {
			return false;
		}
	}

	return true;
}

export const arraysInteresctionCheck = (array1, array2, allowEmpty=false) => {
	if (!allowEmpty && (array1.length <= 0 || array2.length <= 0)) return false;
	let intersection = array1.filter(value => array2.includes(value));
	let result = intersection.length && intersection.length > 0;
	return result;
}


export function bytesToSize(bytes) {
	let sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const operatorToSymbol = (operator='') => {
	switch (operator) {
		case '=':
			return '&equals;';
		case '!=':
			return '&ne;';
		case '>':
			return '&gt;';
		case '>=':
			return '&ge;';
		case '<':
			return '&lt;';
		case '<=':
			return '&le;';
		default:
			return operator;
	}
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function titleCase(str) {
	if (str) {
		var splitStr = str.toLowerCase().split(' ');
		for (var i = 0; i < splitStr.length; i++) {
			// You do not need to check if i is larger than splitStr length, as your for does that for you
			// Assign it back to the array
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		// Directly return the joined string
		return splitStr.join(' ');
	} else {
		return '';
	}
}

export function filterObject(obj, callback) {
	return Object.fromEntries(Object.entries(obj).filter(([key, val]) => callback(val, key)));
}

export const removeElementFromArray = (array, element) => {
	const index = array.indexOf(element);
	if (index > -1) {
		// only splice array when item is found
		array.splice(index, 1); // 2nd parameter means remove one item only
	}
	return array;
};

export const donwloadFile = (url, filename) => {
	var element = document.createElement('a');
	element.setAttribute('href', url);
	element.setAttribute('download', filename);
	element.style.display = 'none';

	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
};

export function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

export function isHidden(el) {
	return (!el || el.offsetHeight <= 0 || el.offsetParent === null || el.style.display === 'none' || el.style.visibility === 'hidden' || el.style.opacity === '0');
}

export const randomString = (length, numbersOnly=false) => {
	let text = '';
	let possibleAlphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let possibleOnlyNumeric = '0123456789';
	
	let possible = numbersOnly ? possibleOnlyNumeric : possibleAlphanumeric;

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

export const hideElement = (elementId) => {
	try {
		const element = document.getElementById(elementId);
		element.style.display = 'none';
	} catch (error) {
		console.error(error);
	}
};

export const showElement = (elementId, displayStyle = 'block') => {
	try {
		const element = document.getElementById(elementId);
		element.style.display = displayStyle;
	} catch (error) {
		console.error(error);
	}
};

export const isIterable = (obj) => {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}
	return typeof obj[Symbol.iterator] === 'function';
};

export const toggleElement = (elementId, displayStyle = 'block') => {
	try {
		const element = document.getElementById(elementId);
		if (element.style.display == 'none') {
			element.style.display = displayStyle;
		} else {
			element.style.display = 'none';
		}
	} catch (error) {
		console.error(error);
	}
};

export function formatNumber(number, style, minDecimals = 0, maxDecimals = 0, currency = 'USD') {
	let formatter;
	switch (style) {
		case 'currency':
			formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
				minimumFractionDigits: minDecimals,
				maximumFractionDigits: maxDecimals
			});
			break;

		case 'percent':
			formatter = new Intl.NumberFormat('en-US', {
				style: 'percent',
				minimumFractionDigits: minDecimals,
				maximumFractionDigits: maxDecimals
			});
			break;

		case 'number':
			formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: minDecimals,
				maximumFractionDigits: maxDecimals
			});
			break;

		default:
			break;
	}
	return formatter ? formatter.format(number) : number;
}

export function loadFileFromUrl(url, inputQuerySelector, then = () => {}) {
	getFileFromURL(url, (fileBlob) => {
		// Load img blob to input
		// WIP: UTF8 character error
		let fileName = 'sample-data.quickai.csv';
		let file = new File(
			[fileBlob],
			fileName, {
				type: 'text/csv',
				lastModified: new Date().getTime()
			},
			'utf-8'
		);
		let container = new DataTransfer();
		container.items.add(file);
		document.querySelector(inputQuerySelector).files = container.files;
		then();
	});
}
// xmlHTTP return blob respond
function getFileFromURL(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		callback(xhr.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}


export const changeRoute = (routeId='') => {
	let anchorElement = document.createElement('a');
	anchorElement.href = '/'+routeId;
	anchorElement.style.display = 'none';
	document.body.appendChild(anchorElement);
	anchorElement.click();
}

export const getTimestamp = (returnSeconds=false) => {
	let timestamp = Date.now();
	if (returnSeconds) timestamp=timestamp/1000;
	return timestamp;
}

export const toggleModal = (modalId, action) => { // actions: toggle, open, closes
	try{
		let modal = document.getElementById(modalId);
		if (!modal) return;
		switch (action) {
			case 'toggle':
				modal.classList.toggle('hidden');
				modal.style.display = modal.style.display == 'block' ? 'none' : 'block';
				break;
			case 'open':
				modal.classList.remove('hidden');
				modal.style.display = 'block';
				break;
			case 'close':
				modal.classList.add('hidden');
				modal.style.display = 'none';
				break;

			default:
				break;
		}
	}catch(error){
		console.error(error);
	}
}

// export const logError = (error) => {
// 	let currentTimeStamp = new Date().toISOString();
// 	recordData({
// 			event: 'error',
// 			error: error?error.message?error.message:error:'Unknown error'
// 		},
// 		currentTimeStamp
// 	);
// }

// export const handleError = (error, alertMessage = _messages.generalError) => {
// 	logError(error);
// 	if (alertMessage) window.alert(alertMessage);
// }

// export const handleErrorReturn = (error, alertMessage = _messages.generalError) => {
// 	logError(error);
// 	if (alertMessage) window.alert(alertMessage);
// 	return error;
// }



export const workerValidator = () => {
	try {
		if (!window.wrkr) {
			throw 'Worker not found';
		}
	} catch (error) {
		handleError(error);
	}
}

export const workerPostMessage = (message) => {
	workerValidator();
	if (!message) {
		console.warn('No message to send');
		return;
	}
	try {
		window.wrkr.postMessage(message);
	} catch (error) {
		console.error(error);
		handleError(error);
	}
}

export const workerListener = (callback) => {
	workerValidator();
	try {
		window.wrkr.addEventListener('message', async ({data}) => {
			await callback(data);
		});
	} catch (error) {
		handleError(error);
	}
}


export function isLocalhost() {
	try {
		if (!window) return false;
		return (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
	} catch (error) {
		console.error(error);
		return false;
	}
}

export const getFileType = (file) => {
	try{
		let filename = file.name;
		return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
	}catch(error){
		console.error(error);
		return undefined;
	}
}

export const getPageHeight = () => {
	let body = document.body,
    html = document.documentElement;

	let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	return height;
}

export const blinkElement = async (element, times = 2, interval = 50) => {
	if (!element) return;
	for (let i = 0; i < times; i++) {
		element.style.opacity='0';
		await sleep(interval);
		element.style.opacity='1';
		await sleep(interval);
	}
}