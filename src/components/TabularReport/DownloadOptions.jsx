import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'

const prefix = i18n.t('Download as')

export const DownloadOption = ({ file }) => (
    <a
        className="download-button"
        href={file.url}
        download
        tabIndex="0"
        rel="noreferrer"
        target={file.extension === 'pdf' ? '_blank' : '_self'}
    >
        {prefix} {file.extension}
        <style jsx>{`
            .download-button {
                cursor: pointer;
                outline: none;
                color: #757575;
                font-size: 12px;
                text-transform: uppercase;
                margin-left: 8px;
            }
        `}</style>
    </a>
)

DownloadOption.propTypes = {
    file: PropTypes.shape({
        extension: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }),
}

export const DownloadOptions = ({ fileUrls }) => (
    <div id="download-options-container">
        {fileUrls.map((file, index) => (
            <DownloadOption file={file} key={index} />
        ))}
        <style jsx>{`
            div {
                display: flex;
                justify-content: flex-end;
            }
        `}</style>
    </div>
)

DownloadOptions.propTypes = {
    fileUrls: PropTypes.array.isRequired,
}
