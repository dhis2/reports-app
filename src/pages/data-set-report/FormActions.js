import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/d2-ui-core'
import styles from '../../utils/styles'
import i18n from '../../utils/i18n/locales'

export const FormActions = props => (
    <div id="main-action-button" style={styles.actionsContainer}>
        <Button
            id="main-action-button"
            raised
            color="primary"
            onClick={props.onGetReportClick}
            disabled={props.isGetReportDisabled}
        >
            {i18n.t('Get Report')}
        </Button>
    </div>
)

FormActions.propTypes = {
    isGetReportDisabled: PropTypes.bool.isRequired,
    onGetReportClick: PropTypes.func.isRequired,
}
