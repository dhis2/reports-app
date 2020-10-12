import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { CheckBox } from '@dhis2/d2-ui-core'
import { Button } from '@dhis2/d2-ui-core'
import DataSets from '../../components/DatasetsDropdown'
import { DataSetDimensions } from '../../components/DataSetDimensions'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType'
import OrgUnitsTreeWithExtraOptions from '../../components/OrgUnitsTreeWithExtraOptions'
import NoOfSignatures from '../../components/NoOfSignaturesDropdown'

const Form = props => (
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
                <div id="no-of-signatures-selection">
                    <NoOfSignatures onChange={props.onNoOfSignaturesChange} />
                </div>
            </div>
        </div>
        <div id="main-action-button">
            <Button
                id="main-action-button"
                raised
                color="primary"
                onClick={props.onGetReportClick}
                disabled={props.isGetReportDisabled}
            >
                {i18n.t('Get Report')}
            </Button>
            <style jsx>{`
                div {
                    display: block;
                    margin-top: 48px;
                    margin-bottom: 16px;
                }
            `}</style>
        </div>
    </div>
)

Form.propTypes = {
    selectedUnitOnly: PropTypes.bool.isRequired,
    onDataSetChange: PropTypes.func.isRequired,
    onSelectedUnitOnlyChange: PropTypes.func.isRequired,
    isGetReportDisabled: PropTypes.bool.isRequired,
    onGetReportClick: PropTypes.func.isRequired,
    onNoOfSignaturesChange: PropTypes.func.isRequired,
}

export default Form
