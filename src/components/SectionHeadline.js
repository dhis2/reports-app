import React from 'react'
import PropTypes from 'prop-types'
import PageHelper from '../components/PageHelper'
import { getDocsUrl } from '../utils/getDocsUrl'

export const SectionHeadline = props => (
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
        <PageHelper url={getDocsUrl(props.systemVersion, props.sectionKey)} />
        <style jsx>{`
            .back-button {
                cursor: pointer;
                outline: none;
            }
        `}</style>
    </h1>
)

SectionHeadline.propTypes = {
    label: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool,
    sectionKey: PropTypes.string.isRequired,
    systemVersion: PropTypes.object.isRequired,
    onBackClick: PropTypes.func,
}

SectionHeadline.defaultProps = {
    showBackButton: false,
    onBackClick: () => undefined,
}
