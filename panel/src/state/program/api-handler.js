import { makeDeleteRequest, makeGetRequest, makeMultiPartPostRequest, makePostRequest, makePutRequest } from '../../common/api-handler';
import { programIsEnableUrl, programListUrl, programTagsUrl, programUrl, searchProgramUrl, uploadFileUrl } from '../../common/path';

export const getProgramsListApiCall = (type, pageNumber) => makeGetRequest(programListUrl(type, pageNumber));

export const getProgramDetailsApiCall = (type, id) => makeGetRequest(programUrl(type, id));

export const deleteProgramsApiCall = (type, id) => makeDeleteRequest(programUrl(type, id));

export const createProgramApiCall = (type, body) => makePostRequest(programListUrl(type), body);

export const updateProgramTagsApiCall = (type, programId, tagId, body) => makePutRequest(programTagsUrl(type, programId, tagId), body);

export const deleteProgramTagsApiCall = (type, programId, tagId) => makeDeleteRequest(programTagsUrl(type, programId, tagId));

export const updateProgramApiCall = (type, id, body) => makePutRequest(programUrl(type, id), body);

export const uploadProgramImageApiCall = (body) => makeMultiPartPostRequest(uploadFileUrl(), body);

export const searchProgramApiCall = (type, query) => makeGetRequest(searchProgramUrl(type, query));

export const enableOrDisableProgramApiCall = (id, programType, enable) => makePutRequest(programIsEnableUrl(id, programType, enable));
