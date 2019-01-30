import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import feedback from './feedback';
import standardReport from './standardReport';

export default combineReducers({
    router: routerReducer,
    feedback,
    standardReport,
});
