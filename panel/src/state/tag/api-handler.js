import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { searchTagUrl, tagListUrl, tagUrl } from '../../common/path';

export const getTagListApiCall = (pageNumber) => makeGetRequest(tagListUrl(pageNumber));

export const createTagApiCall = (body) => makePostRequest(tagListUrl(), body);

export const updateTagApiCall = (body, id) => makePutRequest(tagUrl(id), body);

export const deleteTagApiCall = (id) => makeDeleteRequest(tagUrl(id));

export const searchTagApiCall = (query) => makeGetRequest(searchTagUrl(query));
