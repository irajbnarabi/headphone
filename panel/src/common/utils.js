import toastr from 'toastr';
import history from '../history';

export function setTitle(title) {
	document.title = title;
}

export function persianNumberToLatin(number) {
	const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
	const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
	if (typeof number === 'string') {
		for (let i = 0; i < 10; i++) {
			number = number.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i));
		}
	}
	return number;
}

export class ApiRequestActionTypes {
	constructor(baseType) {
		this.base = baseType;
		this.request = `${this.base}_REQUEST`;
		this.success = `${this.base}_SUCCESS`;
		this.failure = `${this.base}_FAILURE`;
	}

	toString() {
		return this.base;
	}
}

export function notifyError(error) {
	if (error.code === 401) {
		localStorage.removeItem('loginInfo');
		history.push('/login');
	}
	return toastr.error(error?.message || 'خطا در درخواست');
}
