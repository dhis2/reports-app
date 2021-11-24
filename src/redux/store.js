import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'
import history from '../utils/history.js'
import rootReducer from './rootReducer.js'

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), reduxThunk))
)

export default store
