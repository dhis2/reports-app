import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DownloadOptions.module.css'

const prefix = i18n.t('Download as')

export const DownloadOption = ({ file }) => (
    <a
        className={styles.downloadButton}
        href={file.url}
        download
        tabIndex="0"
        rel="noreferrer"
        target={file.extension === 'pdf' ? '_blank' : '_self'}
    >
        {prefix} {file.extension}
    </a>
)

DownloadOption.propTypes = {
    file: PropTypes.shape({
        extension: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }),
}

export const DownloadOptions = ({ fileUrls }) => (
    <div className={styles.downloadOptionsContainer}>
        {fileUrls.map((file) => (
            <DownloadOption file={file} key={file.url} />
        ))}
    </div>
)

DownloadOptions.propTypes = {
    fileUrls: PropTypes.array.isRequired,
}
