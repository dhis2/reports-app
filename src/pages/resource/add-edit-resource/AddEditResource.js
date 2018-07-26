/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

/* material-ui */
import { Dialog } from 'material-ui';

/* d2-ui */
import { Button, InputField, SelectField, CheckBox, SvgIcon, TextField } from '@dhis2/d2-ui-core';

/* styles */
import appStyles from '../../../styles';
import styles from './AddEditResource.style';

/* app conf */
import { FILE_RESOURCES_ENDPOINT, DOCUMENTS_ENDPOINT, RESOURCE_TYPES, TYPES } from '../resource.conf';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

const initialState = {
    resource: {
        name: null,
        type: TYPES.UPLOAD_FILE, // default UPLOAD_FILE
        attachment: false,
        external: false,
        url: 'http://',
    },
    selectedFileToUpload: null,
};

class AddEditResource extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(initialState));
    }

    /* Handle form changes */
    onChangeName = (name) => {
        this.setState({ resource: { ...this.state.resource, name } });
    };

    onChangeType = (type) => {
        this.setState({ resource: { ...this.state.resource, type: type.id, external: type.external } });
    };

    onChangeAttachment = (event) => {
        this.setState({ resource: { ...this.state.resource, attachment: event.target.checked } });
    };

    onChangeFileResource = (event) => {
        this.setState({ selectedFileToUpload: event.target.files[0] });
    };

    onChangeUrl = (url) => {
        this.setState({ resource: { ...this.state.resource, url } });
    };

    /* add resource */
    addResource = () => {
        if (this.ifFormValid()) {
            const api = this.props.d2.Api.getApi();
            if (api) {
                const formData = new FormData();
                formData.append('file', this.state.selectedFileToUpload);
                api.post(FILE_RESOURCES_ENDPOINT, formData).then((response) => {
                    if (response.response) {
                        this.addDocument(response.response.fileResource);
                    }
                }).catch(() => {
                    // TODO: manage error
                });
            }
        }
    };

    /* add document */
    addDocument = (fileResource) => {
        const api = this.props.d2.Api.getApi();
        const documentData = this.state.resource;
        if (this.state.resource.type === TYPES.UPLOAD_FILE) {
            documentData.url = fileResource.id;
        }
        if (api) {
            api.post(DOCUMENTS_ENDPOINT, documentData).then((response) => {
                if (response) {
                    this.close(true);
                }
            }).catch(() => {
                // TODO: manage error
            });
        }
    };

    ifFormValid = () => true;

    /* close dialog */
    close = (refreshList) => {
        this.props.onRequestClose(refreshList);
    };

    render() {
        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={this.close}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
            </Button>,
            <Button
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                disabled={!this.ifFormValid()}
                onClick={this.state.resource.type === TYPES.UPLOAD_FILE ? this.addResource : this.addDocument}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];

        return (
            <Dialog
                autoDetectWindowHeight
                autoScrollBodyContent
                title={i18n.t(i18nKeys.resource.addNewResourceTitle)}
                actions={actions}
                modal
                contentStyle={styles.dialog}
                open={this.props.open}
            >
                <span className={'row'} style={styles.rightsMessage}>
                    {i18n.t(i18nKeys.messages.rightsMessage)}
                </span>
                {/* details */}
                <div className={'row'} style={styles.sectionBox}>
                    <div className={'col-xs-12'} style={styles.sectionTitle}>
                        {i18n.t(i18nKeys.resource.details)}
                    </div>
                    <div className={'col-xs-12'} style={styles.sectionContent}>
                        {/* resource name */}
                        <InputField
                            fullWidth
                            name="resourceName"
                            label={i18n.t(i18nKeys.resource.nameLabel)}
                            value={this.state.resource.name || ''}
                            onChange={this.onChangeName}
                        />
                        {/* resource type */}
                        <SelectField
                            style={styles.width100}
                            name={'resourceType'}
                            label={i18n.t(i18nKeys.resource.typeLabel)}
                            items={RESOURCE_TYPES}
                            value={this.state.resource.type}
                            onChange={this.onChangeType}
                        />
                        {/* resource attachment */}
                        <div
                            id={'upload_type_fields'}
                            style={this.state.resource.type === TYPES.UPLOAD_FILE ?
                                { display: 'block' } :
                                { display: 'none' }
                            }
                        >
                            <CheckBox
                                id={'resourceAttachment'}
                                label={i18n.t(i18nKeys.resource.attachmentLabel)}
                                checked={this.state.resource.attachment}
                                onChange={this.onChangeAttachment}
                            />
                            {/* file */}
                            {/* hidden file input */}
                            <input
                                style={{ display: 'none' }}
                                type="file"
                                // eslint-disable-next-line
                                ref={(fileInput) => { this.fileInput = fileInput; }}
                                onChange={this.onChangeFileResource}
                            />
                            {/* file input interface */}
                            <div style={styles.uploadFileInput}>
                                <SvgIcon
                                    icon={'Add'}
                                    style={styles.uploadFileInputIcon}
                                />
                                <TextField
                                    readOnly
                                    fullWidth
                                    floatingLabelFixed
                                    name={'fileName'}
                                    hintText={i18n.t(i18nKeys.resource.noFileChosen)}
                                    floatingLabelText={i18n.t(i18nKeys.resource.fileLabel)}
                                    value={this.state.selectedFileToUpload ? this.state.selectedFileToUpload.name : ''}
                                    // eslint-disable-next-line
                                    onClick={() => this.fileInput.click()}
                                />
                            </div>
                        </div>
                        {/* url */}
                        <InputField
                            style={this.state.resource.type === TYPES.UPLOAD_FILE ?
                                { display: 'none' } :
                                { display: 'block' }
                            }
                            fullWidth
                            name="resourceUrl"
                            label={i18n.t(i18nKeys.resource.urlLabel)}
                            value={this.state.resource.url || ''}
                            onChange={this.onChangeUrl}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default AddEditResource;
