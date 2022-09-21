import { makeFinalRequest, makePostRequest } from '../general/general-service';

export const sendAnalyticsEvent = (eventName, body) => {
	const finalRequestUrl = makeFinalRequest(`analytics/${eventName}`);
	makePostRequest(finalRequestUrl, body).then();
}
