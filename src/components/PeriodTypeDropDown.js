import React from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'

/* styles */
import styles from '../utils/styles'

const labelText = i18n.t('Select Period Type')

function PeriodTypeDropDown({ loading, ...props }) {
    if (loading) {
        return (
            <span style={styles.error}>
                {i18n.t('Loading period types dropdown')}
            </span>
        )
    }

    return (
        <DropDown
            fullWidth
            emptyLabel={labelText}
            hintText={labelText}
            {...props}
        />
    )
}

PeriodTypeDropDown.propTypes = {
    loading: PropTypes.bool.isRequired,
}

export default PeriodTypeDropDown
