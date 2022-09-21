export const searchIntroMoviesReducer = (state = [], action) => {
	switch (action.type) {
		case 'SEARCH_INTRO_MOVIES_DATA_SET':
			return action.payload;
		case 'SEARCH_INTRO_MOVIES_NULL_DATA':
			return state;
		default:
			return state;
	}
};
export const searchIntroSeriesReducer = (state = [], action) => {
	switch (action.type) {
		case 'SEARCH_INTRO_SERIES_DATA_SET':
			return action.payload;
		case 'SEARCH_INTRO_SERIES_NULL_DATA':
			return state;
		default:
			return state;
	}
};
