import { makeFinalRequest, makeGetRequest } from '../general/general-service';

export function getMovieData (id) {
	const finalRequestUrl = makeFinalRequest(`headphone/movies/${id}/page`);
	return makeGetRequest(finalRequestUrl);
}

export function getMovieRelatedPart (id) {
	const finalRequestUrl = makeFinalRequest(`headphone/movies/${id}/related`);
	return makeGetRequest(finalRequestUrl);
}

export function getVideoStreamLink (id) {
	const finalRequestUrl = makeFinalRequest(`headphone/videos/${id}/link`);
	return makeGetRequest(finalRequestUrl);
}
