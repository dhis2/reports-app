import i18n from '@dhis2/d2-i18n'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import { getApi } from '../../../utils/api.js'
import {
    reportTypes,
    REPORTS_ENDPOINT,
    REPORT_TEMPLATES_ENDPOINT,
} from '../standard.report.conf.js'
import styles from './DesignFileDownloadButton.module.css'

export const DesignFileDownloadButton = ({
    isEditing,
    reportType,
    reportId,
}) => {
    let url
    let label
    const api = getApi()
    const type = reportType === reportTypes.HTML ? 'html' : 'xml'

    if (isEditing) {
        label = i18n.t('Get current design')
        url = `${api.baseUrl}/${REPORTS_ENDPOINT}/${reportId}/design`
    } else {
        label =
            reportType === reportTypes.HTML
                ? i18n.t('Get HTML Report Template')
                : i18n.t('Get Jasper Report Template')
        url = `${api.baseUrl}/${REPORT_TEMPLATES_ENDPOINT}.${type}`
    }

    return (
        <div>
            <FormHelperText>{label}</FormHelperText>
            <FormHelperText>
                <Button variant="contained" component="span">
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a
                        href={url}
                        target="_blank"
                        download={type !== 'html'}
                        className={styles.downloadLink}
                    >
                        {i18n.t('Download')}
                    </a>
                </Button>
            </FormHelperText>
            <FormHelperText />
        </div>
    )
}

DesignFileDownloadButton.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    reportId: PropTypes.string.isRequired,
    reportType: PropTypes.string.isRequired,
}
