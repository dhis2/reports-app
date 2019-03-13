import React from 'react'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import i18n from '@dhis2/d2-i18n'
import { Button } from '../../../../components/form/Button'

export const Actions = props => (
    <DialogActions>
        <Button
            label={props.onSubmitLabel}
            isPrimary={true}
            onClick={props.onSubmit}
        />

        <Button label={props.onCancelLabel} onClick={props.onCancel} />
    </DialogActions>
)

Actions.propTypes = {
    onSubmitLabel: PropTypes.string.isRequired,
    onCancelLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

Actions.defaultProps = {
    onCancelLabel: i18n.t('Cancel'),
}
