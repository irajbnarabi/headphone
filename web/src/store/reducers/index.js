import { combineReducers }                                    from 'redux';
import homeReducer                                            from './home.reducer';
import profileReducer                                         from './profile.reducer';
import seriesReducer                                          from './series-landing.reducer';
import { searchIntroMoviesReducer, searchIntroSeriesReducer } from './search.reducer';
import movieDetailsReducer                                    from './movie.reducer';

const allReducers = combineReducers({
	homeData         : homeReducer,
	seriesData       : seriesReducer,
	profileData      : profileReducer,
	searchIntroMovies: searchIntroMoviesReducer,
	searchIntroSeries: searchIntroSeriesReducer,
	movieDetail      : movieDetailsReducer
});
export default allReducers;
