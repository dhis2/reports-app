import PropTypes from 'prop-types'
import React from 'react'

import { getDocsUrl } from '../utils/getDocsUrl'
import AppContext from '../pages/AppContext'
import PageHelper from '../components/PageHelper'

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
        <AppContext.Consumer>
            {({ d2 }) => (
                <PageHelper
                    url={getDocsUrl(d2.system.version, props.sectionKey)}
                />
            )}
        </AppContext.Consumer>
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
    onBackClick: PropTypes.func,
}

SectionHeadline.defaultProps = {
    showBackButton: false,
    onBackClick: () => undefined,
}
