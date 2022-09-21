import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { tagDefinitionListUrl, tagDefinitionTagsUrl, tagDefinitionUrl } from '../../common/path';

export const getTagDefinitionListApiCall = (pageNumber) => makeGetRequest(tagDefinitionListUrl(pageNumber));

export const createTagDefinitionApiCall = (body) => makePostRequest(tagDefinitionListUrl(), body);

export const getTagDefinitionDetailApiCall = (id) => makeGetRequest(tagDefinitionUrl(id));

export const updateTagDefinitionApiCall = (id, body) => makePutRequest(tagDefinitionUrl(id), body);

export const deleteTagDefinitionApiCall = (id) => makeDeleteRequest(tagDefinitionUrl(id));

export const getTagDefinitionTagsApiCall = (id, prefix) => makeGetRequest(tagDefinitionTagsUrl(id, prefix));
