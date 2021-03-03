import React from 'react'
import PropTypes from 'prop-types'
import FormHelperText from '@material-ui/core/FormHelperText'
import blue from '@material-ui/core/colors/blue'

export const HelpText = ({ children }) => (
    <FormHelperText style={{ color: blue[800] }}>{children}</FormHelperText>
)

HelpText.propTypes = {
    children: PropTypes.node.isRequired,
}
