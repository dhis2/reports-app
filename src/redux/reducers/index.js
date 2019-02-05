import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from '../../utils/history'

import feedback from './feedback'
import standardReport from './standardReport'
import periodTypes from './periodTypes'
import organisationUnits from './organisationUnits'

export default combineReducers({
    router: connectRouter(history),
    feedback,
    standardReport,
    periodTypes,
    organisationUnits,
})
