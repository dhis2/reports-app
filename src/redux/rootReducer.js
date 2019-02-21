import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from '../utils/history'

import feedback from './reducers/feedback'
import standardReport from './reducers/standardReport'
import reportPeriod from './reducers/reportPeriod'
import organisationUnits from './reducers/organisationUnits'
import { dataSet } from './reducers/dataSet'
import { dataSetDimensions } from './reducers/dataSetDimensions'
import { dataSetReport } from './reducers/dataSetReport'
import { htmlReport } from './reducers/htmlReport'
import { pagination } from './reducers/pagination'

export default combineReducers({
    router: connectRouter(history),
    feedback,
    standardReport,
    dataSetReport,
    reportPeriod,
    organisationUnits,
    dataSet,
    dataSetDimensions,
    htmlReport,
    pagination,
})
