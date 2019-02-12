import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from '../utils/history'

import feedback from './reducers/feedback'
import standardReport from './reducers/standardReport'
import dataSetReport from './reducers/dataSetReport'
import reportPeriod from './reducers/reportPeriod'
import organisationUnits from './reducers/organisationUnits'
import { dataSet } from './reducers/dataSet'
import { reportingRateSummary } from './reducers/reportingRateSummary'
import { htmlReport } from './reducers/htmlReport'

export default combineReducers({
    router: connectRouter(history),
    feedback,
    standardReport,
    dataSetReport,
    reportPeriod,
    organisationUnits,
    dataSet,
    reportingRateSummary,
    htmlReport,
})
