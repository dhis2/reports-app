import React from 'react'
import PropTypes from 'prop-types'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import i18n from '@dhis2/d2-i18n'
import { getApi } from '../../../utils/api'
import {
    reportTypes,
    REPORTS_ENDPOINT,
    REPORT_TEMPLATES_ENDPOINT,
} from '../standard.report.conf'

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
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                    >
                        Download
                    </a>
                </Button>
            </FormHelperText>
            <FormHelperText />
            <style jsx>{`
                a {
                    color: inherit;
                    text-decoration: none;
                }
            `}</style>
        </div>
    )
}

DesignFileDownloadButton.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    reportType: PropTypes.string.isRequired,
    reportId: PropTypes.string.isRequired,
}
