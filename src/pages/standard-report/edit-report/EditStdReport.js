/* React */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
/* material-ui */
import { Dialog } from 'material-ui';
/* app components */
import { Button } from '@dhis2/d2-ui-core';
/* i18n */
import { i18nKeys } from '../../../i18n';
import i18n from '../../../locales';
/* styles */
import appStyles from '../../../styles';

class EditStdReport extends PureComponent {
    static propTypes = {
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={this.props.onRequestClose}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
            </Button>,
            <Button
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                onClick={this.props.onRequestClose}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];
        return (
            <Dialog
                title={i18n.t(i18nKeys.standardReport.editReportTitle)}
                actions={actions}
                modal={Boolean(true)}
                open={this.props.open}
            >
                Edit Std Report Content
                <h1>Edit Std Report Content</h1>
                <p>Content 1</p>
                <p>Content 2</p>
                <p>Content 3</p>
                <p>Content 4</p>
                <p>Content 5</p>
            </Dialog>
        );
    }
}

export default EditStdReport;
