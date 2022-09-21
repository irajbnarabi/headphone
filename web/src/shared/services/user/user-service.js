import { getLocalStorage, makeDeleteRequest, makeFinalRequest, makeGetRequest, makePostRequest, makePutRequest, removeLocalStorage } from '../general/general-service';
import { services_api_names, variable_names } from '../general/configs';

const md5 = require('md5');

export function register (principal) {
	const finalRequestUrl = makeFinalRequest(services_api_names.register);
	return makePostRequest(finalRequestUrl, {
		principal: principal
	});
}

export function verify (code, principal, token) {
	const finalRequestUrl = makeFinalRequest(services_api_names.verify);
	return makePostRequest(finalRequestUrl, {
		principal: principal,
		code     : code,
		token    : token ? token : ''
	});
}

export function credential (credential, name) {
	const finalRequestUrl = makeFinalRequest(services_api_names.credentials);
	let data              = {
		credential: md5(credential),
		name      : name
	};
	if (data.name === null || data.name === '') {
		delete data.name;
	}
	return makePutRequest(finalRequestUrl, data, true);
}

export function authenticate (principal, credential) {
	const finalRequestUrl = makeFinalRequest(services_api_names.authenticate);
	return makePostRequest(finalRequestUrl, {
		principal : principal,
		credential: md5(credential)
	});
}

export function resetCredential (principal) {
	const finalRequestUrl = makeFinalRequest(services_api_names.forget_password);
	return makePostRequest(finalRequestUrl, {
		principal: principal
	});
}

export function getProfile () {
	const finalRequestUrl = makeFinalRequest(services_api_names.profile);
	return makeGetRequest(finalRequestUrl);
}

export function updateProfileService (name = '', email = '', credential = '') {
	let data = {
		name      : name,
		email     : email,
		credential: md5(credential)
	};
	if (name === '') {
		delete data.name;
	}
	if (email === '') {
		delete data.email;
	}
	if (credential === '') {
		delete data.credential;
	}
	const finalRequestUrl = makeFinalRequest(services_api_names.profile);
	return makePutRequest(finalRequestUrl, data, true);
}

export function profileUpdatePrincipal (code, principal, token) {
	const finalRequestUrl = makeFinalRequest(services_api_names.profile_update_principal);
	return makePutRequest(finalRequestUrl, {
		principal: principal,
		code     : code,
		token    : token
	}, true);
}

export const logout = () => {
	logoutService();
	removeLocalStorage(variable_names.user_is_login);
	removeLocalStorage(variable_names.token);
	removeLocalStorage(variable_names.principal);
};

export const checkUserIsLogin = () => getLocalStorage(variable_names.token, true) !== null;

export const getFavList = () => {
	const finalRequestUrl = makeFinalRequest(`users/favorites`);
	return makeGetRequest(finalRequestUrl);
};

export const addToFavorite = (programId) => {
	const finalRequestUrl = makeFinalRequest(`users/favorites/${programId}`);
	return makePostRequest(finalRequestUrl);
};

export const removeFromFavorite = (programId) => {
	const finalRequestUrl = makeFinalRequest(`users/favorites/${programId}`);
	return makeDeleteRequest(finalRequestUrl);
};

export const getSessions = () => {
	const finalRequestUrl = makeFinalRequest(`users/sessions`);
	return makeGetRequest(finalRequestUrl);
};

export const terminateOtherSessions = () => {
	const finalRequestUrl = makeFinalRequest(`users/terminate-other-sessions`);
	return makePostRequest(finalRequestUrl);
};

export const terminateSpecialSession = (id) => {
	const finalRequestUrl = makeFinalRequest(`users/sessions/${id}`);
	return makeDeleteRequest(finalRequestUrl);
};

export const likeProgram = (id, type, status) => {
	const finalRequestUrl = makeFinalRequest(`headphone/${type}/${id}/like`);
	return status === 'do_like' ? makePutRequest(finalRequestUrl) : makeDeleteRequest(finalRequestUrl);
};

export const dislikeProgram = (id, type, status) => {
	const finalRequestUrl = makeFinalRequest(`headphone/${type}/${id}/dislike`);
	return status === 'do_dislike' ? makePutRequest(finalRequestUrl) : makeDeleteRequest(finalRequestUrl);
};

export const logoutService = () => {
	const finalRequestUrl = makeFinalRequest(`users/logout`);
	return makePostRequest(finalRequestUrl);
};
