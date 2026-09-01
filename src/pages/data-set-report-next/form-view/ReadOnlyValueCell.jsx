/*
 * The one seam cut in the vendored form.
 *
 * Upstream, every cell in the grid is a `DataEntryField`, and that component is
 * the entry point to the entire editing machinery: a component per value type,
 * final-form registration, mutation and sync state, locking, validation
 * tooltips, min/max limits, the data details side panel, and keyboard focus
 * management across the table.
 *
 * A report wants none of it. It wants a number in a cell.
 *
 * These two components have the same names and take the same props as the
 * upstream pair, and live at the import path the vendored files expect
 * (`../data-entry-cell/index.js`), so the layout components above them are
 * unmodified. `disabled` arrives already set for greyed fields, so a field the
 * form greys out reads as greyed here for free.
 */
import PropTypes from 'prop-types'
import React from 'react'
import styles from './FormView.module.css'
import { useValueStore } from './shared/useValueStore.js'

/** Values that mean "nothing was recorded" rather than a real zero. */
const isBlank = (value) => value === undefined || value === null || value === ''

/*
 * Booleans are stored as 'true'/'false' and read badly in a printed table.
 * Everything else the report returns is already a display string.
 */
const formatValue = (value, valueType) => {
    if (valueType === 'BOOLEAN' || valueType === 'TRUE_ONLY') {
        if (value === 'true' || value === true) {
            return 'Yes'
        }
        if (value === 'false' || value === false) {
            return 'No'
        }
    }

    return String(value)
}

export const DataEntryCell = ({ children }) => (
    <td className={styles.cell}>{children}</td>
)

DataEntryCell.propTypes = {
    children: PropTypes.node,
}

export const DataEntryField = ({
    dataElement,
    categoryOptionCombo,
    disabled,
}) => {
    const value = useValueStore((state) =>
        state.getDataValue({
            dataElementId: dataElement.id,
            categoryOptionComboId: categoryOptionCombo.id,
        })
    )?.value

    if (disabled) {
        /*
         * A greyed field is one the form says does not apply to this data
         * element and combination. Rendered as struck-through empty space so
         * that "not applicable" and "nobody filled it in" do not look alike on
         * a printout.
         */
        return <span className={styles.greyed} aria-label="Not applicable" />
    }

    if (isBlank(value)) {
        return <span className={styles.empty}>–</span>
    }

    return (
        <span className={styles.value}>
            {formatValue(value, dataElement.valueType)}
        </span>
    )
}

DataEntryField.propTypes = {
    categoryOptionCombo: PropTypes.shape({ id: PropTypes.string.isRequired })
        .isRequired,
    dataElement: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valueType: PropTypes.string,
    }).isRequired,
    disabled: PropTypes.bool,
}

/*
 * Upstream this reports which cell the cursor is in, so the row and column
 * headers can highlight. Nothing is ever active in a report.
 */
export const useActiveCell = () => ({
    deId: undefined,
    cocId: undefined,
})
