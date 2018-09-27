import { createStore } from 'redux';
import createHistory from 'history/createHashHistory';

import rootReducer from './reducers/index';

export const history = createHistory();

/* eslint-disable no-underscore-dangle */
const store = createStore(
    rootReducer,
    (process.env.NODE_ENV === 'development') ?
        (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) : '',
);
/* eslint-enable */

export default store;
