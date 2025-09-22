import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import DataSets from '../../components/DatasetsDropdown.jsx'
import { OrgUnitsTreeWithExtraOptions } from '../../components/OrgUnitsTreeWithExtraOptions.jsx'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType.jsx'
import { actionsContainer } from '../../utils/styles/shared.jsx'

export const Form = (props) => (
    <div id="report-rate-summary-form">
        <div className="row">
            <div className="col-xs-12 col-md-6">
                <OrgUnitsTreeWithExtraOptions />
                  <button
                    id="main-action-button"
            onClick={props.loadReportData}
                disabled={!props.isActionEnabled}
                >
                    {i18n.t('Get Report')}
                </button>
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
        {actionsContainer.styles}
    </div>
)

Form.propTypes = {
    isActionEnabled: PropTypes.bool.isRequired,
    loadReportData: PropTypes.func.isRequired,
}

Form.defaultProps = {
    showForm: true,
}
