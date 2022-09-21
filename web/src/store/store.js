import { createStore } from 'redux';
import allReducers     from './reducers';

const configureStore = () => {
	const preloadedState = window.PRELOADED_STATE;
	return createStore(
		allReducers,
		preloadedState,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);
};

export default configureStore;
