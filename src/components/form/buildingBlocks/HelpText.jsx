import blue from '@material-ui/core/colors/blue'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'

export const HelpText = ({ children }) => (
    <FormHelperText style={{ color: blue[800] }}>{children}</FormHelperText>
)

HelpText.propTypes = {
    children: PropTypes.node.isRequired,
}
