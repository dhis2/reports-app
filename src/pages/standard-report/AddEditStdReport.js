import { Button } from '@dhis2/d2-ui-core'
import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { Dialog } from 'material-ui'

import {
    CONTEXT_MENU_ACTION,
    cacheStrategies,
    reportTypeOptions,
    reportTypes,
} from './standard.report.conf'
import { CheckBoxGroups } from '../../components/form/CheckBoxGroups'
import { CheckBoxes } from '../../components/form/CheckBoxes'
import { DesignFileDownloadButton } from './add-edit-report/DesignFileDownloadButton'
import { File } from '../../components/form/File'
import { FormRow } from '../../components/form/FormRow'
import { Input } from '../../components/form/Input'
import { formOptions } from '../../utils/react/propTypes'
import { getEditFormInitialValues } from '../../redux/selectors/standardReport/getEditFormInitialValues'
import { relativePeriods } from '../../utils/periods/relativePeriods'
import {
    validateNewReport,
    validateReportUpdate,
} from './add-edit-report/validate'
import Select from '../../components/form/Select'
import appStyles from '../../utils/styles'
import styles from './add-edit-report/AddEditStdReport.style'

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

                        <FormRow>
                            <Input name="name" placeholder={i18n.t('Name*')} />
                        </FormRow>

                        <FormRow>
                            <Field
                                name="type"
                                placeholder={i18n.t('Report Type*')}
                                options={reportTypeOptions}
                                showErrorText={false}
                                component={Select}
                            />
                        </FormRow>

                        {values.type === reportTypes.JASPER_REPORT_TABLE && (
                            <FormRow>
                                <Field
                                    name="reportTable"
                                    placeholder={i18n.t('Report Table*')}
                                    options={props.reportTables}
                                    showErrorText={false}
                                    component={Select}
                                />
                            </FormRow>
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
                        <FormRow>
                            <Field
                                name="cacheStrategy"
                                placeholder={i18n.t('Cache Strategy*')}
                                options={cacheStrategies}
                                component={Select}
                            />
                        </FormRow>
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
