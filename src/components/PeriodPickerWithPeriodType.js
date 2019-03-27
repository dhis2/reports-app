/* React */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import parsePeriod from 'd2/period/parser'

/* d2-ui components */
import { PeriodPicker } from '@dhis2/d2-ui-core'

/* Children */
import PeriodTypeDropDown from './PeriodTypeDropDown'

/* Actions */
import { selectPeriodType, selectPeriod } from '../redux/actions/reportPeriod'
import { getTranslatedPeriodTypes } from '../redux/selectors/reportPeriod/getTranslatedPeriodTypes'
import { formLabel } from '../utils/styles/shared.js'

export function PeriodPickerWithPeriodType({
    selectPeriodType,
    selectPeriod,
    label,
    collection,
    loading,
    selectedPeriodType,
    selectedPeriod,
}) {
    return (
        <div>
            <span className={formLabel.className}>{label}</span>
            <PeriodTypeDropDown
                loading={loading}
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
            {selectedPeriod && (
                <div className="parsed-period">
                    {parsePeriod(selectedPeriod).name}
                </div>
            )}
            <style jsx>{`
                .parsed-period {
                    margin-bottom: 16px;
                }
            `}</style>
            <style>{formLabel.styles}</style>
        </div>
    )
}

PeriodPickerWithPeriodType.propTypes = {
    selectPeriodType: PropTypes.func.isRequired,
    selectPeriod: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedPeriodType: PropTypes.string,
    selectedPeriod: PropTypes.string,
}

const mapStateToProps = state => ({
    ...state.reportPeriod,
    collection: getTranslatedPeriodTypes(state),
})

export default connect(
    mapStateToProps,
    {
        selectPeriodType,
        selectPeriod,
    }
)(PeriodPickerWithPeriodType)
