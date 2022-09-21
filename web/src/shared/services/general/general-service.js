import { serviceConfigs }       from './configs';
import * as localStorageService from './local-storage-service';
import * as httpService         from './http-service';
import React, { forwardRef }    from 'react';
import Slide                    from '@material-ui/core/Slide';

export function makeGetRequest (url, haveToken = true) {
	return httpService.GET(url, haveToken);
}

export function makePostRequest (url, params, haveToken = true) {
	return httpService.POST(url, params, haveToken);
}

export function makePutRequest (url, params, haveToken = true) {
	return httpService.PUT(url, params, haveToken);
}

export function makeDeleteRequest (url, haveToken = true) {
	return httpService.DELETE(url, haveToken);
}

export function makeFinalRequest (url, params = {}) {
	return serviceConfigs.base_url + serviceConfigs.version + url + makeQueryStringFromDictionary(params);
}

export function makeQueryStringFromDictionary (params = {}) {
	let output = '';
	if (params && typeof params != 'undefined') {
		output += '?';
		for (const key of Object.keys(params)) {
			output += key + '=' + params[ key ] + '&';
		}
	}
	output = output.substr(0, output.length - 1);
	return output;
}

export function setTitle (title) {
	document.title = title;
}

export function persianNumberToLatin (number) {
	let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
	let arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
	if (typeof number === 'string') {
		for (let i = 0; i < 10; i++) {
			number = number.replace(persianNumbers[ i ], String(i)).replace(arabicNumbers[ i ], String(i));
		}
	}
	return number;
}

export function latinNumberToPersian (number) {
	let persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
	let arabicNumbers  = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
	if (typeof number === 'string') {
		for (let i = 0; i < 10; i++) {
			number = number.replace(String(i), persianNumbers[ i ]).replace(String(i), arabicNumbers[ i ]);
		}
	}
	return number;
}

export function isPlatformBrowser () {
	return typeof window !== 'undefined';
}

export function setLocalStorage (key, data, is_pure = false) {
	localStorageService.SET(key, data, is_pure);
}

export function getLocalStorage (key, is_pure = false) {
	return localStorageService.GET(key, is_pure);
}

export function removeLocalStorage (key) {
	localStorageService.REMOVE(key);
}

export function updateLocalStorage (key, value, is_pure = false) {
	localStorageService.UPDATE(key, value, is_pure);
}

export function clearLocalStorage () {
	localStorageService.CLEAR();
}

export const ModalTransition = forwardRef(function Transition (props, ref) {
	return <Slide direction="up"
				  ref={ref}
				  {...props} />;
});

export const handleTimeStamp = (value, type = '') => {
	const persianDate = new Date(value).toLocaleString('fa-ir').toString();
	const time        = persianDate.split('،')[ 1 ].split(':')[ 0 ] + ':' + persianDate.split('،')[ 1 ].split(':')[ 1 ];
	let date          = persianDate.split('،')[ 0 ].replaceAll('/', ' / ');
	date              = date.split('/')[ 2 ] + '/' + date.split('/')[ 1 ] + '/' + date.split('/')[ 0 ];
	if (type === 'onlyTime') {
		return time;
	} else if (type === 'onlyDate') {
		return date;
	} else {
		return time + ' - ' + date;
	}
};
