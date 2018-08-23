import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedback from './feedback';

export default combineReducers({
    router: routerReducer,
    feedback,
});
