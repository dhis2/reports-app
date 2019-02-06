import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from '../../utils/history'

import feedback from './feedback'
import standardReport from './standardReport'
import dataSetReport from './dataSetReport'
import reportPeriod from './reportPeriod'
import organisationUnits from './organisationUnits'

export default combineReducers({
    router: connectRouter(history),
    feedback,
    standardReport,
    dataSetReport,
    reportPeriod,
    organisationUnits,
})
