/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/* styles */
import styles from '../utils/styles'

class PageHelper extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    }

    render() {
        return (
            <a
                style={styles.helpLink}
                className="helper-icon material-icons"
                href={this.props.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                help
            </a>
        )
    }
}

export default PageHelper
