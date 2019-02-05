import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class NoMatch extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                <h3>
                    No match for <code>{this.props.location.pathname}</code>
                </h3>
            </div>
        )
    }
}

export default NoMatch
