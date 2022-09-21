import { pages } from '../../view/components/layout/constant';
import layoutTypes from './types';

const initialState = {
	activeRoute: '/',
	itemsOpen: Object.values(pages)
		.filter((page) => page.children)
		.reduce((result, page) => ({ ...result, [page.key]: false }), {}),
};

const layoutReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case layoutTypes.SET_ACTIVE_ROUTE:
			return {
				...state,
				activeRoute: payload.activeRoute,
			};
		case layoutTypes.SET_ITEM_OPEN:
			return {
				...state,
				itemsOpen: {
					...state.itemsOpen,
					...payload.newValue,
				},
			};
		default:
			return state;
	}
};

export default layoutReducer;
