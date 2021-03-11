import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import history from '../utils/history'
import { dataSet } from './reducers/dataSet'
import { dataSetDimensions } from './reducers/dataSetDimensions'
import { dataSetReport } from './reducers/dataSetReport'
import { feedback } from './reducers/feedback'
import { organisationUnits } from './reducers/organisationUnits'
import { orgUnitDistReport } from './reducers/orgUnitDistReport'
import { orgUnitGroupSets } from './reducers/orgUnitGroupSets'
import { pagination } from './reducers/pagination'
import { reportData } from './reducers/reportData'
import { reportPeriod } from './reducers/reportPeriod'
import { resource } from './reducers/resource'
import { standardReport } from './reducers/standardReport'
import { standardReportTables } from './reducers/standardReportTables'

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
