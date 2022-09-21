import { makeDeleteRequest, makeGetRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { roleListUrl, roleUrl } from '../../common/path';

export const getRoleListApiCall = (pageNumber = 1) => makeGetRequest(roleListUrl(pageNumber));

export const createRoleApiCall = (body) => makePostRequest(roleListUrl(), body);

export const updateRoleApiCall = (body, id) => makePutRequest(roleUrl(id), body);

export const deleteRoleApiCall = (id) => makeDeleteRequest(roleUrl(id));

export const getRoleDetailsApiCall = (id) => makeGetRequest(roleUrl(id));
