import PropTypes from 'prop-types'
import React from 'react'

const NoMatch = (props) => (
    <div>
        <h3>
            No match for <code>{props.location.pathname}</code>
        </h3>
    </div>
)

NoMatch.propTypes = {
    location: PropTypes.object.isRequired,
}

export default NoMatch
