/* React */
import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
const Report = ({ reportHtml }) => (
    <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
)

Report.propTypes = {
    reportHtml: PropTypes.string.isRequired,
}

export default Report
