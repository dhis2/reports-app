import React from 'react'
import PropTypes from 'prop-types'
import Report from '../../components/Report'
import i18n from '../../utils/i18n/locales'
import HtmlReportComment from './HtmlReportComment'
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
                <HtmlReportComment
                    comment={props.reportComment}
                    dataSetId={props.selectedDataSet.id}
                    period={props.selectedPeriod}
                    orgUnitId={props.selectedOrgUnit.id}
                    shareDataSetReportComment={props.shareDataSetReportComment}
                    setDataSetReportComment={props.setDataSetReportComment}
                />
            </div>
            <Report reportHtml={props.reportHtml} />
        </div>
    )
}

HtmlReport.propTypes = {
    showForm: PropTypes.bool.isRequired,
    reportHtml: PropTypes.string.isRequired,
    reportComment: PropTypes.string.isRequired,
    dataSetId: PropTypes.string.isRequired,
    selectedDataSet: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    onDownloadXlsClick: PropTypes.func.isRequired,
    shareDataSetReportComment: PropTypes.func.isRequired,
    setDataSetReportComment: PropTypes.func.isRequired,
    selectedOrgUnit: PropTypes.object,
}

HtmlReport.defaultProps = {
    selectedOrgUnit: null,
}
