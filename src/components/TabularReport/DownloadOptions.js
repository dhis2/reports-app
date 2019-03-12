import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import styles from '../../utils/styles'

const prefix = i18n.t('Download as')

export const DownloadOption = ({ file }) => (
    <a
        style={styles.downloadButton}
        href={file.url}
        download
        tabIndex="0"
        target={file.extension === 'pdf' ? '_blank' : '_self'}
    >
        {prefix} {file.extension}
    </a>
)

DownloadOption.propTypes = {
    file: PropTypes.shape({
        url: PropTypes.string.isRequired,
        extension: PropTypes.string.isRequired,
    }),
}

export const DownloadOptions = ({ fileUrls }) => (
    <div id="download-options-container" style={styles.downloadContainer}>
        {fileUrls.map((file, index) => (
            <DownloadOption file={file} key={index} />
        ))}
    </div>
)

DownloadOptions.propTypes = {
    fileUrls: PropTypes.array.isRequired,
}
