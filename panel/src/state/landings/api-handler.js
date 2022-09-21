import { makeGetRequest, makePostRequest } from '../../common/api-handler';
import { landingsUrl } from '../../common/path';

export const getLandingsDataApiCall = (type) => makeGetRequest(landingsUrl(type));

export const updateLandingsDataApiCall = (type, data) => makePostRequest(landingsUrl(type), { carousels: data });
