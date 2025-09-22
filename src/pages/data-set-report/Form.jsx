import i18n from '@dhis2/d2-i18n'
import { CheckBox } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { DataSetDimensions } from '../../components/DataSetDimensions.jsx'
import DataSets from '../../components/DatasetsDropdown.jsx'
import { OrgUnitsTreeWithExtraOptions } from '../../components/OrgUnitsTreeWithExtraOptions.jsx'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType.jsx'

const Form = (props) => (
    <div id="data-set-report-form">
        <div className="row">
            <div className="col-xs-12 col-md-6">
                <OrgUnitsTreeWithExtraOptions />
            </div>

            <div className="col-xs-12 col-md-6">
                <div id="data-set-selection">
                    <DataSets onChange={props.onDataSetChange} />
                </div>
                <div id="data-set-dimensions-container">
                    <DataSetDimensions />
                </div>
                <div id="report-period">
                    <PeriodPickerComponent label={i18n.t('Report period')} />
                </div>
                <CheckBox
                    id="selected-unit-only"
                    onChange={props.onSelectedUnitOnlyChange}
                    value={props.selectedUnitOnly}
                    label={i18n.t('Use data for selected unit only')}
                />
            </div>
            <div className="col-xs-12 col-md-6">
                <button
                    id="main-action-button"
                    onClick={props.onGetReportClick}
                    disabled={props.isGetReportDisabled}
                >
                    {i18n.t('Get Report')}
                </button>
            </div>
        </div>
    </div>
)

Form.propTypes = {
    isGetReportDisabled: PropTypes.bool.isRequired,
    selectedUnitOnly: PropTypes.bool.isRequired,
    onDataSetChange: PropTypes.func.isRequired,
    onGetReportClick: PropTypes.func.isRequired,
    onSelectedUnitOnlyChange: PropTypes.func.isRequired,
}

export default Form
