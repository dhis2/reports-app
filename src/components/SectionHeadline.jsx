import PropTypes from 'prop-types'
import React from 'react'
import PageHelper from '../components/PageHelper.jsx'
import { getDocsUrl } from '../utils/getDocsUrl.js'
import styles from './SectionHeadline.module.css'

export const SectionHeadline = (props) => (
    <h1 className={styles.headline}>
        {props.showBackButton && (
            <button
                id="back-button"
                className={`material-icons ${styles.backButton}`}
                type="button"
                onClick={props.onBackClick}
                aria-label="Go back"
            >
                arrow_back
            </button>
        )}

        {props.label}
        <PageHelper url={getDocsUrl(props.sectionKey)} />
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
