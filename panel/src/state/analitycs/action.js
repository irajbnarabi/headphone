import analyticsTypes from './type';
import { getAnalyticsDataApiCall, getAnalyticsHotDataApiCall } from './api-handler';

const getData = (eventName, from, to, body) => async (dispatch) => {
	dispatch({
		type: analyticsTypes.GET_ANALYTICS.request,
		payload: {},
	});
	try {
		const response = await getAnalyticsDataApiCall(eventName, from, to, body);
		dispatch({
			type: analyticsTypes.GET_ANALYTICS.success,
			payload: {
				data: response.data.data,
			},
		});
	} catch (error) {
		dispatch({
			type: analyticsTypes.GET_ANALYTICS.failure,
			payload: {},
		});
	}
};

const getHotData = (eventName, from, to, body, page = 1) => async (dispatch) => {
	dispatch({
		type: analyticsTypes.GET_HOTS.request,
		payload: {},
	});
	try {
		const response = await getAnalyticsHotDataApiCall(eventName, from, to, body, page);
		dispatch({
			type: analyticsTypes.GET_HOTS.success,
			payload: {
				hotData: response.data.data,
				hotTotalPages: response.data.metadata.pageCount,
			},
		});
	} catch (error) {
		dispatch({
			type: analyticsTypes.GET_HOTS.failure,
			payload: {},
		});
	}
};

const analyticsActions = {
	getData,
	getHotData,
};
export default analyticsActions;
