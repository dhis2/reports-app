import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../utils/i18n/locales'
import styles from '../../utils/styles'

export const DownloadOptions = props => (
    <div id="download-options-container" style={styles.downloadContainer}>
        <span
            style={styles.downloadButton}
            role="button"
            tabIndex="0"
            onClick={props.onDownloadXlsClick}
        >
            {i18n.t('download as xls')}
        </span>
    </div>
)

DownloadOptions.propTypes = {
    onDownloadXlsClick: PropTypes.func.isRequired,
}
