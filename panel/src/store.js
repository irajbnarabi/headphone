import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';
import RootReducer from './state/root-reducer';

export default createStore(RootReducer, applyMiddleware(thunk));
