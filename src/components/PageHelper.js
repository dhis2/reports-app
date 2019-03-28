/* React */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class PageHelper extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    }

    render() {
        return (
            <a
                className="helper-icon material-icons"
                href={this.props.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                help
                <style jsx>{`
                    a {
                        padding-left: 12px;
                        color: #276696;
                        text-decoration: none;
                    }
                `}</style>
            </a>
        )
    }
}

export default PageHelper
