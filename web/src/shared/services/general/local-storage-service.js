import { isPlatformBrowser } from './general-service';

export function SET (key, data, is_pure) {
	if (isPlatformBrowser()) {
		if (is_pure) {
			localStorage.setItem(key, data);
		} else {
			localStorage.setItem(key, btoa(escape(JSON.stringify(data))));
		}
	}
}

export function GET (key, is_pure): any {
	if (isPlatformBrowser()) {
		if (is_pure) {
			return localStorage.getItem(key);
		} else {
			if (localStorage.getItem(key)) {
				return JSON.parse(unescape(atob(localStorage.getItem(key))));
			}
		}
	}
	return null;
}

export function CLEAR () {
	if (isPlatformBrowser()) {
		localStorage.clear();
	}
}

export function REMOVE (key) {
	if (isPlatformBrowser()) {
		localStorage.removeItem(key);
	}
}

export function UPDATE (key, value, is_pure = false) {
	REMOVE(key);
	SET(key, value, is_pure);
}
