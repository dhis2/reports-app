import React from 'react'
import PropTypes from 'prop-types'
import Report from '../../components/report/Report'
import i18n from '../../utils/i18n/locales'
import ShareComment from './Share'
import styles from '../../utils/styles'

export const HtmlReport = props => {
    const shouldRender =
        props.reportHtml && !props.showForm && props.selectedDataSet
    const reportContainerStyles = {
        display: props.reportHtml && !props.showForm ? 'block' : 'none',
    }

    if (!shouldRender) return null

    return (
        <div id="report-container" style={reportContainerStyles}>
            <div
                id="download-options-container"
                style={styles.downloadContainer}
            >
                <span
                    style={styles.downloadButton}
                    role="button"
                    tabIndex="0"
                    onClick={props.onDownloadXlsClick}
                >
                    {i18n.t('download as xls')}
                </span>
            </div>
            <div id="share-component">
                <ShareComment
                    dataSetId={props.selectedDataSet.id}
                    period={props.selectedPeriod}
                    orgUnitId={props.selectedOrgUnit}
                />
            </div>
            <Report reportHtml={props.reportHtml} />
        </div>
    )
}

HtmlReport.propTypes = {
    showForm: PropTypes.bool.isRequired,
    reportHtml: PropTypes.string.isRequired,
    dataSetId: PropTypes.object.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.object.isRequired,
    selectedOrgUnit: PropTypes.object.isRequired,
    onDownloadXlsClick: PropTypes.func.isRequired,
}
