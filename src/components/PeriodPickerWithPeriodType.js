import i18n from '@dhis2/d2-i18n'
import { DropDown, PeriodPicker } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { selectPeriod, selectPeriodType } from '../redux/actions/reportPeriod'
import { getFilteredPeriodTypes } from '../redux/selectors/reportPeriod/periodTypes'
import { isFixedPeriodType } from '../utils/periods/fixedPeriods'
import { formLabel } from '../utils/styles/shared.js'

const periodTypeLabelText = i18n.t('Select Period Type')

export function PeriodPickerWithPeriodType({
    selectPeriodType,
    selectPeriod,
    label,
    collection,
    selectedPeriodType,
}) {
    const onDropDownChange = event => {
        selectPeriodType(event)

        // relative periods can be selected from the first dropdown
        if (!isFixedPeriodType(event.target.value)) {
            selectPeriod(event.target.value)
        }
    }

    return (
        <div>
            <span className={formLabel.className}>{label}</span>
            <DropDown
                fullWidth
                emptyLabel={periodTypeLabelText}
                hintText={periodTypeLabelText}
                menuItems={collection}
                onChange={onDropDownChange}
                value={selectedPeriodType}
            />
            {selectedPeriodType && isFixedPeriodType(selectedPeriodType) && (
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
    collection: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    selectPeriod: PropTypes.func.isRequired,
    selectPeriodType: PropTypes.func.isRequired,
    selectedPeriodType: PropTypes.string,
}

const mapStateToProps = state => ({
    ...state.reportPeriod,
    collection: getFilteredPeriodTypes(state),
})

export default connect(mapStateToProps, {
    selectPeriodType,
    selectPeriod,
})(PeriodPickerWithPeriodType)
