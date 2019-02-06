import React from 'react'
import PropTypes from 'prop-types'
import { DropDown } from '@dhis2/d2-ui-core'
import i18n from '@dhis2/d2-i18n'

/* styles */
import styles from '../../utils/styles'

const labelText = i18n.t('Select Period Type')

function PeriodTypeDropDown({ ready, loadingError, ...props }) {
    if (!ready) {
        return (
            <span style={styles.error}>
                {i18n.t('Loading period types dropdown')}
            </span>
        )
    }

    if (loadingError) {
        return <span style={styles.error}>{loadingError}</span>
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
    ready: PropTypes.bool.isRequired,
    loadingError: PropTypes.string.isRequired,
}

export default PeriodTypeDropDown
