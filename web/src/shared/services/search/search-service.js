import { makeFinalRequest, makeGetRequest } from '../general/general-service';
import { services_api_names }               from '../general/configs';

export function getSearchDetails (context) {
	const finalRequestUrl = makeFinalRequest(services_api_names.search, {
		q: context
	});
	return makeGetRequest(finalRequestUrl);
}

export function getMoreSearchData (context, type, page = 1) {
	const finalRequestUrl = makeFinalRequest(services_api_names.search, {
		q    : context,
		types: type,
		page : page
	});
	return makeGetRequest(finalRequestUrl);
}

export function getSearchIntroMovies () {
	const finalRequestUrl = makeFinalRequest(services_api_names.search_intro_movies);
	return makeGetRequest(finalRequestUrl);
}

export function getSearchIntroSeries () {
	const finalRequestUrl = makeFinalRequest(services_api_names.search_intro_series);
	return makeGetRequest(finalRequestUrl);
}
