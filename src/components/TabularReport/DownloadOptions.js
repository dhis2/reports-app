import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../utils/i18n/locales'
import styles from '../../utils/styles'

const prefix = i18n.t('Download as')

export const DownloadOption = ({ url, extension }, key) => (
    <a style={styles.downloadButton} href={url} download tabIndex="0" key={key}>
        {prefix} {extension}
    </a>
)

DownloadOption.propTypes = {
    url: PropTypes.string.isRequired,
    extension: PropTypes.string.isRequired,
    key: PropTypes.number.isRequired,
}

export const DownloadOptions = ({ fileUrls }) => (
    <div id="download-options-container" style={styles.downloadContainer}>
        {fileUrls.map(DownloadOption)}
    </div>
)

DownloadOptions.propTypes = {
    fileUrls: PropTypes.array.isRequired,
}
