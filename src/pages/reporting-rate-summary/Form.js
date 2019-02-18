import React from 'react'
import PropTypes from 'prop-types'
import { Button, DropDown } from '@dhis2/d2-ui-core'
import i18n from '../../utils/i18n/locales'
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
                <div id="criteria-selection">
                    <span style={styles.formLabel}>{i18n.t('Based on')}</span>
                    <DropDown
                        fullWidth
                        value={props.selectedCriteria}
                        onChange={props.selectCriteria}
                        menuItems={props.criteriaOptions}
                    />
                </div>
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
                onClick={props.loadHtmlReport}
                disabled={!props.isActionEnabled}
            >
                {i18n.t('Get Report')}
            </Button>
        </div>
    </div>
)

Form.propTypes = {
    showForm: PropTypes.bool.isRequired,
    selectedCriteria: PropTypes.string.isRequired,
    criteriaOptions: PropTypes.array.isRequired,
    isActionEnabled: PropTypes.bool.isRequired,
    loadHtmlReport: PropTypes.func.isRequired,
    selectCriteria: PropTypes.func.isRequired,
}