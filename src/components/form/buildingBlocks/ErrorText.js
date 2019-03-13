import React from 'react'
import PropTypes from 'prop-types'
import FormHelperText from '@material-ui/core/FormHelperText'
import red from '@material-ui/core/colors/red'

const errorTextColor = red[500]

export const ErrorText = props => {
    if (!props.showErrorText) return null

    return (
        <FormHelperText>
            <span>{props.error && props.touched ? props.error : ''}</span>

            <style jsx>{`
                span {
                    color: ${errorTextColor};
                }
            `}</style>
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
