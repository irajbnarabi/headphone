import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { searchUserByEmail, searchUserByMobile, userInvoices, userListUrl, userUrl } from '../../common/path';

export const getUserListApiCall = (pageNumber = 1) => makeGetRequest(userListUrl(pageNumber));

export const getUserDetailApiCall = (id) => makeGetRequest(userUrl(id));

export const createUserApiCall = (body) => makePostRequest(userListUrl(), body);

export const updateUserApiCall = (body, id) => makePutRequest(userUrl(id), body);

export const deleteUserApiCall = (id) => makeDeleteRequest(userUrl(id));

export const getUserInvoicesApiCall = (id) => makeGetRequest(userInvoices(id));

export const searchUserByEmailApiCall = (email) => makeGetRequest(searchUserByEmail(email));

export const searchUserByPhoneApiCall = (mobile) => makeGetRequest(searchUserByMobile(mobile));
