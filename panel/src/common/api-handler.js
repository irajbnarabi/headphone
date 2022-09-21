import { apiCall, apiCallConfig } from './http-service';

export function makeGetRequest(url, config = {}) {
	return apiCall(apiCallConfig(url, 'GET', {}, config));
}

export function makePostRequest(url, body = {}, config = {}) {
	return apiCall(apiCallConfig(url, 'POST', body, config));
}

export function makeMultiPartPostRequest(url, body = {}, config = {}) {
	return apiCall(apiCallConfig(url, 'POST_MULTI_PART', body, config));
}

export function makePutRequest(url, body = {}, config = {}) {
	return apiCall(apiCallConfig(url, 'PUT', body, config));
}

export function makeDeleteRequest(url, config = {}) {
	return apiCall(apiCallConfig(url, 'DELETE', {}, config));
}
