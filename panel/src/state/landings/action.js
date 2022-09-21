import { getLandingsDataApiCall, updateLandingsDataApiCall } from './api-handler';
import landingsType from './type';

const getLandingsData = (type) => async (dispatch) => {
	dispatch({
		type: landingsType.GET_LANDING.request,
		payload: {},
	});
	try {
		const response = await getLandingsDataApiCall(type);
		dispatch({
			type: landingsType.GET_LANDING.success,
			payload: {
				carousels: response.data.data.carousels,
			},
		});
	} catch (error) {
		dispatch({
			type: landingsType.GET_LANDING.failure,
			payload: { error },
		});
	}
};

const updateLandingsData = (type, carousels) => async (dispatch) => {
	dispatch({
		type: landingsType.UPDATE_LANDING.request,
		payload: {},
	});
	try {
		const response = await updateLandingsDataApiCall(type, carousels);
		dispatch({
			type: landingsType.UPDATE_LANDING.success,
			payload: {
				carousels: response.data.data.carousels,
			},
		});
	} catch (error) {
		dispatch({
			type: landingsType.UPDATE_LANDING.failure,
			payload: { error },
		});
	}
};

const landingsActions = {
	getLandingsData,
	updateLandingsData,
};

export default landingsActions;
