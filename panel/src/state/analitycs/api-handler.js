import { makePostRequest } from '../../common/api-handler';
import { analyticsHotUrl, analyticsUrl } from '../../common/path';

export const getAnalyticsDataApiCall = (eventName, from, to, body) => makePostRequest(analyticsUrl(eventName, from, to), body);

export const getAnalyticsHotDataApiCall = (eventName, from, to, body, page) => makePostRequest(analyticsHotUrl(eventName, from, to, page), body);
