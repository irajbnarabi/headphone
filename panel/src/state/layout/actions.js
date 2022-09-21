import layoutTypes from './types';

const setItemOpen = (newValue) => async (dispatch) => {
	dispatch({ type: layoutTypes.SET_ITEM_OPEN, payload: { newValue } });
};

const setActiveRoute = (activeRoute) => async (dispatch) => {
	dispatch({ type: layoutTypes.SET_ACTIVE_ROUTE, payload: { activeRoute } });
};

const layoutActions = {
	setItemOpen,
	setActiveRoute,
};

export default layoutActions;
