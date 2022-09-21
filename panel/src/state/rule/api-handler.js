import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { ruleListUrl, ruleUrl } from '../../common/path';

export const getRuleListApiCall = (pageNumber = 1) => makeGetRequest(ruleListUrl(pageNumber));

export const createRuleApiCall = (body) => makePostRequest(ruleListUrl(), body);

export const getRuleDetailsApiCall = (id) => makeGetRequest(ruleUrl(id));

export const updateRuleApiCall = (body, id) => makePutRequest(ruleUrl(id), body);

export const deleteRuleApiCall = (id) => makeDeleteRequest(ruleUrl(id));
