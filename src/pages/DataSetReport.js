import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import manageError from './manageError.HOC'
import { Headline } from './data-set-report/Headline'
import { DataInputs } from './data-set-report/DataInputs'
import { FormActions } from './data-set-report/FormActions'
import { HtmlReport } from './data-set-report/HtmlReport'
import { connectDataSetReport } from './data-set-report/connectDataSetReport'
import { isActionEnabled } from './data-set-report/helpers'
import styles from '../utils/styles'

class DataSetReport extends React.Component {
    render() {
        const { props } = this
        const formStyle = { display: props.showForm ? 'block' : 'none' }

        return (
            <div>
                <Headline
                    showForm={props.showForm}
                    onBackClick={props.showDataSetReportForm}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <Paper style={styles.container}>
                    <div id="data-set-report-form" style={formStyle}>
                        <DataInputs
                            showOptions={props.showOptions}
                            selectedOptionsForOrganisationUnitGroupSets={
                                props.selectedOptionsForOrganisationUnitGroupSets
                            }
                            selectedDataSet={props.selectedDataSet}
                            selectedOptionsForDimensions={
                                props.selectedOptionsForDimensions
                            }
                            selectedUnitOnly={props.selectedUnitOnly}
                            onToggleShowOptions={props.toggleShowOptions}
                            onOrganisationUnitChange={props.selectOrgUnit}
                            onOrganisationUnitGroupSetChange={
                                props.selectOptionsForOrganisationUnitGroupSets
                            }
                            onDataSetChange={props.selectDataSet}
                            onDimensionChange={props.selectDimension}
                            onPeriodChange={props.selectPeriod}
                            onSelectedUnitOnlyChange={props.setSelectedUnitOnly}
                        />
                        <FormActions
                            onGetReportClick={props.loadHtmlReport}
                            isGetReportDisabled={!isActionEnabled(props)}
                        />
                    </div>
                    <HtmlReport
                        showForm={props.showForm}
                        dataSetId={props.selectedDataSet.id}
                        selectedDataSet={props.selectedDataSet}
                        selectedPeriod={props.selectedPeriod}
                        selectedOrgUnit={props.selectedOrgUnit}
                        reportHtml={props.reportHtml}
                        onDownloadXlsClick={props.exportReportToXls}
                    />
                </Paper>
            </div>
        )
    }
}

DataSetReport.propTypes = {
    d2: PropTypes.object.isRequired,
    showForm: PropTypes.bool.isRequired,
    reportHtml: PropTypes.string.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    selectedOrgUnit: PropTypes.object.isRequired,
    selectedOptionsForDimensions: PropTypes.object.isRequired,
    selectedOptionsForOrganisationUnitGroupSets: PropTypes.object.isRequired,
    showOptions: PropTypes.bool.isRequired,
    selectedPeriod: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    exportReportToXls: PropTypes.func.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectDataSet: PropTypes.func.isRequired,
    selectOrgUnit: PropTypes.func.isRequired,
    selectDimension: PropTypes.func.isRequired,
    selectPeriod: PropTypes.func.isRequired,
    selectOptionsForOrganisationUnitGroupSets: PropTypes.func.isRequired,
    setSelectedUnitOnly: PropTypes.func.isRequired,
    showDataSetReportForm: PropTypes.func.isRequired,
    toggleShowOptions: PropTypes.func.isRequired,
}

export default DataSetReport
export const ConnectedDataSetReport = connectDataSetReport(
    manageError(DataSetReport)
)
