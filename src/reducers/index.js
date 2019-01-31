import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedback from './feedback';
import periodTypes from './periodTypes';

export default combineReducers({
    router: routerReducer,
    feedback,
    periodTypes,
});
