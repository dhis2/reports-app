import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'
import styles from '../../utils/styles'
import DataSets from '../../components/DatasetsDropdown'
import OrgUnitsTreeWithExtraOptions from '../../components/OrgUnitsTreeWithExtraOptions'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType'

const getSummaryFormStyles = showForm => ({
    display: showForm ? 'block' : 'none',
})

export const Form = props => (
    <div
        id="report-rate-summary-form"
        style={getSummaryFormStyles(props.showForm)}
    >
        <div className="row">
            <div className="col-xs-12 col-md-6">
                <OrgUnitsTreeWithExtraOptions />
            </div>
            <div className="col-xs-12 col-md-6">
                <div id="data-set-selection">
                    <DataSets />
                </div>
                <div id="report-period">
                    <PeriodPickerComponent label={i18n.t('Report period')} />
                </div>
            </div>
        </div>
        <div id="main-action-button" style={styles.actionsContainer}>
            <Button
                raised
                color="primary"
                onClick={props.loadReportData}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Report')}
            </Button>
        </div>
    </div>
)

Form.propTypes = {
    showForm: PropTypes.bool,
    isActionEnabled: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
}

Form.defaultProps = {
    showForm: true,
}
