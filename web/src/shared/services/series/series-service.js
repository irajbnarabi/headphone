import { makeFinalRequest, makeGetRequest } from '../general/general-service';

export function getSeriesDetail (id, seasonNumber = null, episodeNumber = null) {
	const finalRequestUrl = makeFinalRequest(`headphone/series/${id}/page${seasonNumber ? `/${seasonNumber}/${episodeNumber}` : ''}`);
	return makeGetRequest(finalRequestUrl);
}
