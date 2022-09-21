import { makeFinalRequest, makeGetRequest } from '../general/general-service';
import { services_api_names }               from '../general/configs';

export function getHomePage () {
	const url = makeFinalRequest(services_api_names.home_page_data);
	return makeGetRequest(url);
}

export function getSeriesLandingPage () {
	const url = makeFinalRequest(services_api_names.series_landings);
	return makeGetRequest(url);
}
