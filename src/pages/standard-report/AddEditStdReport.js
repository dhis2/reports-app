import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import FormHelperText from '@material-ui/core/FormHelperText'
import { Dialog } from 'material-ui'
import { Button } from '@dhis2/d2-ui-core'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import appStyles from '../../utils/styles'
import { Input } from '../../components/form/Input'
import Select from '../../components/form/Select'
import { formOptions } from '../../utils/react/propTypes'
import { File } from '../../components/form/File'
import { CheckBoxGroups } from '../../components/form/CheckBoxGroups'
import { CheckBoxes } from '../../components/form/CheckBoxes'
import { relativePeriods } from '../../utils/periods/relativePeriods'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { CONTEXT_MENU_ACTION } from '../../pages/standard-report/standard.report.conf'
import {
    reportTypes,
    reportTypeOptions,
    cacheStrategies,
} from './standard.report.conf'
import styles from './add-edit-report/AddEditStdReport.style'
import { DesignFileDownloadButton } from './add-edit-report/DesignFileDownloadButton'
import {
    validateNewReport,
    validateReportUpdate,
} from './add-edit-report/validate'

export const Component = props => (
    <Dialog
        modal
        autoDetectWindowHeight
        autoScrollBodyContent
        open={props.open}
        title={props.edit ? 'Edit report' : 'Add report'}
        contentStyle={styles.dialog}
    >
        <Form
            onSubmit={props.onSubmit}
            validate={props.edit ? validateReportUpdate : validateNewReport}
            initialValues={props.selectedReport}
        >
            {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                    <section style={styles.section}>
                        <div style={styles.sectionTitle}>Details</div>
                        <Input name="name" placeholder={i18n.t('Name*')} />
                        <Field
                            name="type"
                            placeholder={i18n.t('Report Type*')}
                            options={reportTypeOptions}
                            showErrorText={false}
                            component={Select}
                        />
                        {values.type === reportTypes.JASPER_REPORT_TABLE && (
                            <Field
                                name="reportTable"
                                placeholder={i18n.t('Report Table*')}
                                options={props.reportTables}
                                showErrorText={false}
                                component={Select}
                            />
                        )}
                        <div className="row">
                            <div className="col-xs-6">
                                <File
                                    fileAsBlob={true}
                                    name="designContent"
                                    placeholder={
                                        props.edit
                                            ? i18n.t('Design File')
                                            : i18n.t('Design File*')
                                    }
                                />
                            </div>
                            <div className="col-xs-6">
                                <FormHelperText />
                                <DesignFileDownloadButton
                                    isEditing={!!props.selectedReport}
                                    reportType={values.type}
                                    reportId={
                                        props.edit
                                            ? props.selectedReport.id
                                            : ''
                                    }
                                />
                            </div>
                        </div>
                    </section>
                    {values.type !== reportTypes.JASPER_REPORT_TABLE && (
                        <section style={styles.section}>
                            <div style={styles.sectionTitle}>
                                Relative Periods
                            </div>
                            <CheckBoxGroups
                                name="relativePeriods"
                                groups={relativePeriods}
                                displayError={false}
                            />
                        </section>
                    )}
                    {values.type !== reportTypes.JASPER_REPORT_TABLE && (
                        <section style={styles.section}>
                            <div style={styles.sectionTitle}>
                                Report parameters
                            </div>
                            <CheckBoxes
                                name="reportParams"
                                options={[
                                    {
                                        value: 'paramReportingPeriod',
                                        label: 'Reporting Period',
                                    },
                                    {
                                        value: 'paramOrganisationUnit',
                                        label: 'Organisation Unit',
                                    },
                                ]}
                            />
                        </section>
                    )}
                    <section style={styles.section}>
                        <div style={styles.sectionTitle}>Settings</div>
                        <Field
                            name="cacheStrategy"
                            placeholder={i18n.t('Cache Strategy*')}
                            options={cacheStrategies}
                            component={Select}
                        />
                    </section>
                    <section style={styles.section}>
                        <Button
                            raised
                            color="primary"
                            type="submit"
                            onClick={handleSubmit}
                            style={appStyles.dialogBtn}
                        >
                            Submit
                        </Button>
                        <Button
                            raised
                            type="submit"
                            onClick={() => props.onRequestClose(false)}
                            style={appStyles.dialogBtn}
                        >
                            Cancel
                        </Button>
                    </section>
                </form>
            )}
        </Form>
    </Dialog>
)

Component.propTypes = {
    open: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    selectedReport: PropTypes.object.isRequired,
    reportTables: formOptions.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    reportTables: state.standardReportTables.collection,
    selectedReport: getEditFormInitialValues(
        state,
        state.standardReport.selectedAction === CONTEXT_MENU_ACTION.EDIT
    ),
})

const ConnectedComponent = connect(mapStateToProps)(Component)

export { ConnectedComponent as ConnectedAddEditStdReport }
