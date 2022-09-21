import { makePostRequest, makePutRequest } from '../../common/api-handler';
import { getSignInUserUrl, getSignUpUserUrl, getUserCredentialsUrl, getVerifyUserUrl } from '../../common/path';

export const getSignInUserApiCall = (body) => makePostRequest(getSignInUserUrl(), body);

export const getSignUpUserApiCall = (body) => makePostRequest(getSignUpUserUrl(), body);

export const getVerifyUserApiCall = (body) => makePostRequest(getVerifyUserUrl(), body);

export const getUserCredentialsApiCall = (body) => makePutRequest(getUserCredentialsUrl(), body);
