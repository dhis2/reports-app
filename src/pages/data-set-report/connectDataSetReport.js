import { connect } from 'react-redux'
import { updateFeedbackState } from '../../redux/actions/feedback'
import {
    exportReportToXls,
    loadHtmlReport,
    selectDataSet,
    selectDimension,
    selectOrgUnit,
    selectPeriod,
    selectOptionsForOrganisationUnitGroupSets,
    setSelectedUnitOnly,
    showDataSetReportForm,
    toggleShowOptions,
} from '../../redux/actions/dataSetReport'

const mapStateToProps = ({ dataSetReport }) => ({
    showForm: dataSetReport.showForm,
    reportHtml: dataSetReport.reportHtml,
    selectedDataSet: dataSetReport.selectedDataSet,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedOrgUnit: dataSetReport.selectedOrgUnit,
    selectedOptionsForDimensions: dataSetReport.selectedOptionsForDimensions,
    selectedOptionsForOrganisationUnitGroupSets:
        dataSetReport.selectedOptionsForOrganisationUnitGroupSets,
    showOptions: dataSetReport.showOptions,
    selectedPeriod: dataSetReport.selectedPeriod,
    loading: dataSetReport.loading,
})

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
    exportReportToXls: () => dispatch(exportReportToXls()),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
    selectDimension: (id, evt) =>
        dispatch(selectDimension(id, evt.target.value)),
    selectDataSet: dataSet => dispatch(selectDataSet(dataSet)),
    selectOrgUnit: orgUnit => dispatch(selectOrgUnit(orgUnit)),
    selectPeriod: period => dispatch(selectPeriod(period)),
    selectOptionsForOrganisationUnitGroupSets: (id, event) =>
        dispatch(
            selectOptionsForOrganisationUnitGroupSets(id, event.target.value)
        ),
    setSelectedUnitOnly: (e, selectedUnitOnly) =>
        dispatch(setSelectedUnitOnly(selectedUnitOnly)),
    showDataSetReportForm: () => dispatch(showDataSetReportForm()),
    toggleShowOptions: () => dispatch(toggleShowOptions()),
})

export const connectDataSetReport = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
