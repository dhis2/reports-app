import React from 'react'
import PropTypes from 'prop-types'

export const If = ({ condition, children }) => {
    if (condition) {
        return <React.Fragment>{children}</React.Fragment>
    }

    return null
}

If.propTypes = {
    condition: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
}
