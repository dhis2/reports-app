/* React */
import React from 'react'
import PropTypes from 'prop-types'

const PageHelper = props => (
    <a
        className="helper-icon material-icons"
        href={props.url}
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

PageHelper.propTypes = {
    url: PropTypes.string.isRequired,
}

export default PageHelper
