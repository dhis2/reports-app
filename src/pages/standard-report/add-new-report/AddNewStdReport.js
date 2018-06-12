import React, { PureComponent } from 'react';

/* d2-ui */
import { MultiToggle, DatePicker, SelectField, CheckBox, TextField } from '@dhis2/d2-ui-core';
import { FormBuilder, Validators } from '@dhis2/d2-ui-forms';

/* Styles */
import styles from './AddNewStdReport.style';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

class AddNewReport extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.onUpdateField = this.onUpdateField.bind(this);
    }

    onUpdateField() {
        // console.log('###########################3', this.state);
        this.setState({ ...this.state });
    }

    render() {
        const fields = [
            {
                name: 'exampleTextField',
                value: 'Default Value',
                component: TextField,
                props: {
                    floatingLabelText: 'Floating Label',
                    style: { width: '100%' },
                    hintText: 'Example hint text',
                    changeEvent: 'onBlur',
                    type: 'search',
                },
                validators: [{
                    message: 'The field must have a value',
                    validator(value) {
                        return Validators.isRequired(value);
                    },
                }],
            },
            {
                name: 'exampleMultilineTextField',
                value: 'DHIS2',
                component: TextField,
                props: {
                    floatingLabelText: 'Multiline TextField',
                    style: { width: '100%' },
                    hintText: 'Press enter for new line',
                    multiLine: true,
                    changeEvent: 'onBlur',
                },
            },
            {
                name: 'exampleCheckBox',
                value: '',
                component: CheckBox,
                props: {
                    label: 'Checkbox Example',
                    style: { width: '100%' },
                    onCheck: (e, v) => {
                        this.onUpdateField('exampleCheckBox', v ? 'true' : 'false');
                    },
                },
            },
            {
                name: 'exampleDropDown',
                value: null,
                component: SelectField,
                props: {
                    menuItems: [{ id: '1', displayName: 'Option 1' }, { id: '2', displayName: 'Option 2' }],
                    includeEmpty: true,
                    emptyLabel: 'No Options',
                },
            },
            {
                name: 'startDate',
                value: new Date(),
                component: DatePicker,
                props: {
                    floatingLabelText: 'Example Start Date Picker',
                    dateFormat: 'yyyy-MM-dd',
                    allowFuture: false,
                },
                validators: [{
                    message: 'Closed date cannot be before open date',
                    validator(value, formModel) {
                        return Validators.isStartDateBeforeEndDate(value, formModel.fields.endDate.value);
                    },
                }],
            },
            {
                name: 'endDate',
                value: new Date(),
                component: DatePicker,
                props: {
                    floatingLabelText: 'Example End Date Picker',
                    dateFormat: 'yyyy-MM-dd',
                    allowFuture: false,
                },
                validators: [{
                    message: 'Closed date cannot be before open date',
                    validator(value, formModel) {
                        return Validators.isStartDateBeforeEndDate(formModel.fields.startDate.value, value);
                    },
                }],
            },
            {
                name: 'exampleMultiToggle',
                value: '',
                component: MultiToggle,
                props: {
                    items: [
                        {
                            name: 'Monday',
                            value: true,
                            text: 'Monday is best',
                        },
                        {
                            name: 'Friday',
                            text: 'Friday is worst',
                        },
                    ],
                    label: 'Example of MultiToggle',
                    onChange: () => {},
                },
            },
        ];
        return (
            <div>
                <span className={'row'} style={{ color: '#999999', backgroundColor: '#f1f1f1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
                    {i18n.t(i18nKeys.standardReport.addNewReport.reportRightsMessage)}
                </span>
                <div className={'row'} style={styles.sectionBox}>
                    <div className={'col-xs-12'} style={styles.sectionTitle}>
                       Details
                    </div>
                    <FormBuilder
                        fields={fields}
                        onUpdateField={this.onUpdateField}
                    />
                </div>
            </div>
        );
    }
}

export default AddNewReport;
