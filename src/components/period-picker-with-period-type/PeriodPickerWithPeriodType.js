/* React */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

/* d2-ui components */
import { PeriodPicker } from '@dhis2/d2-ui-core'

/* Children */
import PeriodTypeDropDown from './PeriodTypeDropDown'

/* Actions */
import {
    selectPeriodType,
    selectPeriod,
} from '../../redux/actions/reportPeriod'
import pluckPeriodTypes from '../../redux/selectors/periodTypes'

/* styles */
import styles from '../../utils/styles'

export function PeriodPickerWithPeriodType({
    selectPeriodType,
    selectPeriod,
    label,
    collection,
    ready,
    loadingError,
    selectedPeriodType,
}) {
    return (
        <div>
            <span style={{ ...styles.formLabel, display: 'block' }}>
                {label}
            </span>
            <PeriodTypeDropDown
                ready={ready}
                loadingError={loadingError}
                menuItems={collection}
                onChange={selectPeriodType}
                value={selectedPeriodType}
            />
            {selectedPeriodType && (
                <PeriodPicker
                    periodType={selectedPeriodType}
                    onPickPeriod={selectPeriod}
                />
            )}
        </div>
    )
}

PeriodPickerWithPeriodType.propTypes = {
    selectPeriodType: PropTypes.func.isRequired,
    selectPeriod: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
    loadingError: PropTypes.string.isRequired,
    selectedPeriodType: PropTypes.string,
}

const mapStateToProps = ({ reportPeriod }) => ({
    ...reportPeriod,
    collection: pluckPeriodTypes(reportPeriod.collection),
})

export default connect(
    mapStateToProps,
    {
        selectPeriodType,
        selectPeriod,
    }
)(PeriodPickerWithPeriodType)
