import { makeDeleteRequest, makeMultiPartPostRequest, makePutRequest } from '../../common/api-handler';
import { videoOfProgramUrl } from '../../common/path';

export const createVideoOfProgramApiCall = (id, type, body) => makeMultiPartPostRequest(videoOfProgramUrl(id, type), body);

export const editVideoOfProgramApiCall = (id, type, body) => makePutRequest(videoOfProgramUrl(id, type), body);

export const deleteVideoOfProgramApiCall = (programId, programType, videoId) => makeDeleteRequest(videoOfProgramUrl(programId, programType, videoId));
