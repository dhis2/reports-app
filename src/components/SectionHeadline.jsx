import PropTypes from 'prop-types'
import React from 'react'
import PageHelper from '../components/PageHelper.jsx'
import { getDocsUrl } from '../utils/getDocsUrl.js'

export const SectionHeadline = (props) => (
    <h1>
        {props.showBackButton && (
            <span
                id="back-button"
                className="material-icons back-button"
                role="button"
                tabIndex="0"
                onClick={props.onBackClick}
            >
                arrow_back
            </span>
        )}
        {props.label}
        <PageHelper url={getDocsUrl(props.sectionKey)} />
        <style jsx>{`
            h1 {
                margin-bottom: 0;
            }
            .back-button {
                cursor: pointer;
                outline: none;
                padding: 12px;
            }
        `}</style>
    </h1>
)

SectionHeadline.propTypes = {
    label: PropTypes.string.isRequired,
    sectionKey: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool,
    onBackClick: PropTypes.func,
}

SectionHeadline.defaultProps = {
    showBackButton: false,
    onBackClick: () => undefined,
}
