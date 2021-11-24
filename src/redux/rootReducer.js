import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import history from '../utils/history.js'
import { dataSet } from './reducers/dataSet.js'
import { dataSetDimensions } from './reducers/dataSetDimensions.js'
import { dataSetReport } from './reducers/dataSetReport.js'
import { feedback } from './reducers/feedback.js'
import { organisationUnits } from './reducers/organisationUnits.js'
import { orgUnitDistReport } from './reducers/orgUnitDistReport.js'
import { orgUnitGroupSets } from './reducers/orgUnitGroupSets.js'
import { pagination } from './reducers/pagination.js'
import { reportData } from './reducers/reportData.js'
import { reportPeriod } from './reducers/reportPeriod.js'
import { resource } from './reducers/resource.js'
import { standardReport } from './reducers/standardReport.js'
import { standardReportTables } from './reducers/standardReportTables.js'

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
})
