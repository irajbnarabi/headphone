import axios from 'axios';
import { getLoginInfo } from '../state/authenticate/utils';
import { notifyError } from './utils';

const getHeaders = () => {
	const loginInfo = getLoginInfo();
	return loginInfo?.token
		? {
				'Content-Type': 'application/json',
				'X-USER-TOKEN': loginInfo?.token,
		  }
		: { 'Content-Type': 'application/json' };
};

const getMultiPartHeaders = () => {
	const loginInfo = getLoginInfo();
	return loginInfo?.token
		? {
				'X-USER-TOKEN': loginInfo?.token,
		  }
		: {};
};

const getConfig = (url, config) => ({
	method: 'get',
	url,
	headers: getHeaders(),
	...config,
});

const postConfig = (url, body, config) => ({
	method: 'post',
	url,
	headers: getHeaders(),
	data: JSON.stringify(body),
	...config,
});

const postMultiPartConfig = (url, body, config) => ({
	method: 'post',
	url,
	headers: getMultiPartHeaders(),
	data: body,
	...config,
});

const putConfig = (url, body, config) => ({
	method: 'put',
	url,
	headers: getHeaders(),
	data: JSON.stringify(body),
	...config,
});

const deleteConfig = (url, config) => ({
	method: 'delete',
	url,
	headers: getHeaders(),
	...config,
});

export const apiCallConfig = (url, method, body, otherConfigs) => {
	switch (method) {
		case 'GET':
			return getConfig(url, otherConfigs);
		case 'POST':
			return postConfig(url, body, otherConfigs);
		case 'POST_MULTI_PART':
			return postMultiPartConfig(url, body, otherConfigs);
		case 'PUT':
			return putConfig(url, body, otherConfigs);
		case 'DELETE':
			return deleteConfig(url, otherConfigs);
		default:
			return null;
	}
};

export async function apiCall(configFunction) {
	try {
		return axios(configFunction);
	} catch (err) {
		notifyError(err.response.data);
	}
}
