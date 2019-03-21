import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, SelectField } from '@dhis2/d2-ui-core'
import OrganisationUnitsTree from '../../../components/AvailableOrganisationUnitsTree'
import i18n from '@dhis2/d2-i18n'
import appStyles from '../../../utils/styles'

import {
    REPORTS_ENDPOINT,
    REPORT_MODE,
    GET_REPORT_AS_ENDPOINT,
    TYPES,
} from '../standard.report.conf'

class CreateStdReport extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        selectedReport: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        onGetReportData: PropTypes.func,
        open: PropTypes.bool.isRequired,
        onError: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onGetReportData: () => {},
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedOrgUnitId: null,
            selectedPeriod: null,
        }
    }

    componentDidMount() {
        // TODO: validate if always report
        this.loadReportParams(REPORT_MODE.REPORT)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedReport.id !== nextProps.selectedReport.id) {
            this.loadReportParams(REPORT_MODE.REPORT)
        } else {
            this.getReport()
        }
    }

    onChangePeriod = selectedPeriod => {
        this.setState({ selectedPeriod })
    }

    onChangeOrgUnit = selectedOrgUnitId => {
        this.setState({ selectedOrgUnitId })
    }

    // TODO: Possible merge this and getExcelReport method
    getReport = () => {
        const api = this.props.d2.Api.getApi()
        const typeEndpoint =
            this.props.selectedReport.type === TYPES.HTML
                ? GET_REPORT_AS_ENDPOINT.HTML
                : GET_REPORT_AS_ENDPOINT.PDF
        let url = `${REPORTS_ENDPOINT}/${
            this.props.selectedReport.id
        }/${typeEndpoint}?t=${new Date().getTime()}`
        if (this.state.selectedOrgUnitId) {
            url = `${url}&ou=${this.state.selectedOrgUnitId}`
        }
        if (this.state.selectedPeriod) {
            url = `${url}&pe=${this.state.selectedPeriod.id}`
        }
        if (this.props.selectedReport.type === TYPES.HTML) {
            api.get(url)
                .then(response => {
                    this.props.onGetReportData(response)
                })
                .catch(error => {
                    this.props.onError(error)
                })
        } else {
            window.open(`${api.baseUrl}/${url}`)
        }
    }

    getExcelReport = () => {
        const api = this.props.d2.Api.getApi()
        const typeEndpoint = GET_REPORT_AS_ENDPOINT.XLS
        let url = `${REPORTS_ENDPOINT}/${
            this.props.selectedReport.id
        }/${typeEndpoint}?t=${new Date().getTime()}`
        if (this.state.selectedOrgUnitId) {
            url = `${url}&ou=${this.state.selectedOrgUnitId}`
        }
        if (this.state.selectedPeriod) {
            url = `${url}&pe=${this.state.selectedPeriod.id}`
        }
        if (this.props.selectedReport.type === TYPES.HTML) {
            api.get(url)
                .then(response => {
                    this.props.onGetReportData(response)
                })
                .catch(error => {
                    this.props.onError(error)
                })
        } else {
            window.open(`${api.baseUrl}/${url}`)
        }
    }

    loadReportParams = reportMode => {
        const api = this.props.d2.Api.getApi()
        const url = `${REPORTS_ENDPOINT}/${
            this.props.selectedReport.id
        }/parameters?mode=${reportMode}`
        if (api) {
            api.get(url)
                .then(response => {
                    if (response && this.isSet(response)) {
                        if (response.periods) {
                            this.setState({
                                selectedPeriod: response.periods[0],
                            })
                        }
                        this.setState({ ...response }) // params && || periods
                    } else {
                        this.getReport()
                    }
                })
                .catch(error => {
                    this.props.onError(error)
                })
        }
    }

    isSet = (obj = this.state) =>
        !!(
            obj.params &&
            (obj.params.paramReportingPeriod || this.isOrganisationUnitSet(obj))
        )

    isOrganisationUnitSet = (obj = this.state) =>
        !!obj.params &&
        (obj.params.paramOrganisationUnit ||
            obj.params.paramParentOrganisationUnit ||
            obj.params.paramGrandParentOrganisationUnit)

    isReportingPeriod = () =>
        !!this.state.periods &&
        this.state.periods.length > 0 &&
        this.state.params &&
        this.state.params.paramReportingPeriod

    displayPeriods = () => {
        if (this.isReportingPeriod()) {
            if (!this.state.selectedPeriod) {
                this.setState({
                    selectedPeriod: this.state.periods[0],
                })
            }
            return (
                <SelectField
                    selector={'periods'}
                    label={i18n.t('Reporting Period')}
                    items={this.state.periods}
                    value={
                        this.state.selectedPeriod
                            ? this.state.selectedPeriod.id
                            : this.state.periods[0].id
                    }
                    onChange={this.onChangePeriod}
                />
            )
        }
        return null
    }

    displayOrgUnitTree = () => {
        if (this.state.params && this.isOrganisationUnitSet()) {
            return (
                <div style={{ height: 350 }}>
                    <div>{i18n.t('Organisation Unit')}</div>
                    <OrganisationUnitsTree
                        d2={this.props.d2}
                        onChange={this.onChangeOrgUnit}
                    />
                </div>
            )
        }
        return null
    }

    validate = () => {
        if (this.isReportingPeriod() && this.isOrganisationUnitSet()) {
            return !!(this.state.selectedPeriod && this.state.selectedOrgUnitId)
        } else if (this.isReportingPeriod()) {
            return !!this.state.selectedPeriod
        } else if (this.isOrganisationUnitSet()) {
            return !!this.state.selectedOrgUnitId
        }
        return false
    }

    render() {
        if (this.isSet()) {
            return (
                <Dialog
                    autoScrollBodyContent
                    autoDetectWindowHeight
                    modal
                    open={this.props.open}
                >
                    <DialogTitle>{i18n.t('Create Report Table')}</DialogTitle>
                    <DialogContent>
                        <div id={'create-std-report-form-id'}>
                            {this.displayPeriods()}
                            {this.displayOrgUnitTree()}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <span
                            id="create-std-report-cancel-action-id"
                            key="create-std-report-cancel-action-id"
                        >
                            <Button
                                key={'cancel-btn-key'}
                                style={appStyles.dialogBtn}
                                onClick={this.props.onRequestClose}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </span>
                        <span
                            id="create-std-report-export-action-id"
                            key="create-std-report-export-action-id"
                        >
                            <Button
                                key={'export-excel-btn-key'}
                                style={appStyles.dialogBtn}
                                disabled={!this.validate()}
                                onClick={this.getExcelReport}
                            >
                                {i18n.t('Download as excel')}
                            </Button>
                        </span>
                        <span
                            id="create-std-report-get-action-id"
                            key="create-std-report-get-action-id"
                        >
                            <Button
                                key={'get-report-key'}
                                raised
                                color={'primary'}
                                style={appStyles.dialogBtn}
                                disabled={!this.validate()}
                                onClick={this.getReport}
                            >
                                {i18n.t('Get Report')}
                            </Button>
                        </span>
                    </DialogActions>
                </Dialog>
            )
        }
        return null
    }
}

export default CreateStdReport
