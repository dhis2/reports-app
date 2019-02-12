import React from 'react'
import PropTypes from 'prop-types'
import PageHelper from '../components/PageHelper'
import styles from '../utils/styles'
import { getDocsUrl } from '../utils/getDocsUrl'

export const SectionHeadline = props => (
    <h1>
        {props.showBackButton && (
            <span
                id="back-button"
                style={styles.backButton}
                className="material-icons"
                role="button"
                tabIndex="0"
                onClick={props.onBackClick}
            >
                arrow_back
            </span>
        )}
        {props.label}
        <PageHelper url={getDocsUrl(props.systemVersion, props.sectionKey)} />
    </h1>
)

SectionHeadline.propTypes = {
    label: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool.isRequired,
    sectionKey: PropTypes.string.isRequired,
    systemVersion: PropTypes.object.isRequired,
    onBackClick: PropTypes.func.isRequired,
}
