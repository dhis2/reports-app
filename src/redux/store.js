import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'

import history from '../utils/history'
import rootReducer from './reducers/index'

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), reduxThunk))
)

export default store
