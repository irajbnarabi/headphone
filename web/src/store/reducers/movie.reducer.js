const initialMovieDetail = {
	movieData: {},
	isLoad   : false
};

const movieDetailsReducer = (state = initialMovieDetail, action) => {
	switch (action.type) {
		case `MOVIE_DETAIL_DATA_SET_${action.id}`:
			return {
				movieData: action.movieData,
				isLoad   : action.isLoad
			};
		case 'MOVIE_DETAIL_NULL_DATA':
			return state;
		default:
			return state;
	}
};
export default movieDetailsReducer;
