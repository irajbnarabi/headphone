import { getLocalStorage } from './general-service';
import { variable_names }  from './configs';

const axios = require('axios');

export function GET (url, haveToken) {
	return axios.get(url, {
		headers: updateHeaderRequest(haveToken)
	}).then(
		(response) => {
			return response;
		}
	);
}

export function POST (url, params, haveToken) {
	return axios.post(url, params, {
		headers: updateHeaderRequest(haveToken)
	}).then(
		(response) => {
			return response;
		}
	);
}

export function PUT (url, params, haveToken) {
	return axios.put(url, params, {
		headers: updateHeaderRequest(haveToken)
	}).then(
		(response) => {
			return response;
		}
	);
}

export function DELETE (url, haveToken) {
	return axios.delete(url, {
		headers: updateHeaderRequest(haveToken)
	}).then(
		(response) => {
			return response;
		}
	);
}

function updateHeaderRequest (haveToken) {
	let headers         = {};
	headers[ 'accept' ] = '*/*';
	if (haveToken && getLocalStorage(variable_names.token, true)) {
		headers[ 'X-USER-TOKEN' ] = getLocalStorage(variable_names.token, true);
	}
	return headers;
}
