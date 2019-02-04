import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createHistory from 'history/createHashHistory';

import rootReducer from './reducers/index';

export const history = createHistory();

/* eslint-disable no-underscore-dangle */
const store = createStore(
    rootReducer,
    (process.env.NODE_ENV === 'development') ?
        (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) : '',
    applyMiddleware(reduxThunk),
);
/* eslint-enable */

export default store;
