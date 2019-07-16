import i18n from '@dhis2/d2-i18n'
import { DropDown, PeriodPicker } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { selectPeriod, selectPeriodType } from '../redux/actions/reportPeriod'
import { getTranslatedPeriodTypes } from '../redux/selectors/reportPeriod/getTranslatedPeriodTypes'
import { formLabel } from '../utils/styles/shared.js'

const periodTypeLabelText = i18n.t('Select Period Type')

export function PeriodPickerWithPeriodType({
    selectPeriodType,
    selectPeriod,
    label,
    collection,
    selectedPeriodType,
}) {
    return (
        <div>
            <span className={formLabel.className}>{label}</span>
            <DropDown
                fullWidth
                emptyLabel={periodTypeLabelText}
                hintText={periodTypeLabelText}
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
            {formLabel.styles}
        </div>
    )
}

PeriodPickerWithPeriodType.propTypes = {
    selectPeriodType: PropTypes.func.isRequired,
    selectPeriod: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    collection: PropTypes.array.isRequired,
    selectedPeriodType: PropTypes.string,
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
