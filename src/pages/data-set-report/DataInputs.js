import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../utils/i18n/locales'
import { CheckBox } from '@dhis2/d2-ui-core'
import DataSets from '../../components/DatasetsDropdown'
import DataSetOptions from '../../components/DataSetDimensions'
import PeriodPickerComponent from '../../components/PeriodPickerWithPeriodType'
import { OrgUnitsTree } from './OrgUnitsTree'

export const DataInputs = props => (
    <div className="row">
        <OrgUnitsTree
            showOptions={props.showOptions}
            selectedOptionsForOrganisationUnitGroupSets={
                props.selectedOptionsForOrganisationUnitGroupSets
            }
            onOrgUnitChange={props.onOrganisationUnitChange}
            toggleShowOptions={props.onToggleShowOptions}
            onOrganisationUnitGroupSetChange={
                props.onOrganisationUnitGroupSetChange
            }
        />
        <div className="col-xs-12 col-md-6">
            <div id="data-set-selection">
                <DataSets onChange={props.onDataSetChange} />
            </div>
            {props.selectedDataSet && props.selectedDataSet.id && (
                <div id="data-set-dimensions-container">
                    <DataSetOptions
                        dataSetId={props.selectedDataSet.id}
                        values={props.selectedOptionsForDimensions}
                        onChange={props.onDimensionChange}
                    />
                </div>
            )}
            <div id="report-period">
                <PeriodPickerComponent
                    label={i18n.t('Report period')}
                    onChange={props.onPeriodChange}
                />
            </div>
            <CheckBox
                id="selected-unit-only"
                onChange={props.onSelectedUnitOnlyChange}
                value={props.selectedUnitOnly}
                label={i18n.t('Use data for selected unit only')}
            />
        </div>
    </div>
)

DataInputs.propTypes = {
    showOptions: PropTypes,
    selectedOptionsForOrganisationUnitGroupSets: PropTypes,
    selectedDataSet: PropTypes,
    selectedOptionsForDimensions: PropTypes,
    selectedUnitOnly: PropTypes,
    onToggleShowOptions: PropTypes.func.isRequired,
    onOrganisationUnitChange: PropTypes.func.isRequired,
    onOrganisationUnitGroupSetChange: PropTypes.func.isRequired,
    onDataSetChange: PropTypes.func.isRequired,
    onDimensionChange: PropTypes.func.isRequired,
    onPeriodChange: PropTypes.func.isRequired,
    onSelectedUnitOnlyChange: PropTypes.func.isRequired,
}
