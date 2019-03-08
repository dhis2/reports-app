import React from 'react'
import PropTypes from 'prop-types'
import FormHelperText from '@material-ui/core/FormHelperText'

export const ErrorText = props => {
    if (!props.showErrorText) return null

    return (
        <FormHelperText>
            {props.error && props.touched ? props.error : ''}
        </FormHelperText>
    )
}

ErrorText.propTypes = {
    error: PropTypes.string.isRequired,
    touched: PropTypes.bool.isRequired,
    showErrorText: PropTypes.bool,
}

ErrorText.defaultProps = {
    showErrorText: true,
}
