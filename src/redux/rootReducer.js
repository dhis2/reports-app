import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from '../utils/history'

import { feedback } from './reducers/feedback'
import { standardReport } from './reducers/standardReport'
import { standardReportTables } from './reducers/standardReportTables'
import { reportPeriod } from './reducers/reportPeriod'
import { organisationUnits } from './reducers/organisationUnits'
import { orgUnitGroupSets } from './reducers/orgUnitGroupSets'
import { dataSet } from './reducers/dataSet'
import { dataSetDimensions } from './reducers/dataSetDimensions'
import { dataSetReport } from './reducers/dataSetReport'
import { reportData } from './reducers/reportData'
import { pagination } from './reducers/pagination'
import { orgUnitDistReport } from './reducers/orgUnitDistReport'
import { resource } from './reducers/resource'
import { dataSetNoOfSignatuesReport } from './reducers/dataSetNoOfSignatuesReport'

export default combineReducers({
    router: connectRouter(history),
    feedback,
    standardReport,
    standardReportTables,
    dataSetReport,
    reportPeriod,
    organisationUnits,
    orgUnitGroupSets,
    dataSet,
    dataSetDimensions,
    reportData,
    pagination,
    orgUnitDistReport,
    resource,
    dataSetNoOfSignatuesReport,
})
