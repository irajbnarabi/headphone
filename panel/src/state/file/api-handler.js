import {makeMultiPartPostRequest} from '../../common/api-handler';
import {uploadFileUrl} from '../../common/path';

export const uploadImageApiCall = (body) => makeMultiPartPostRequest(uploadFileUrl(), body);

export const uploadVideoApiCall = (body) => makeMultiPartPostRequest(uploadFileUrl(), body);
