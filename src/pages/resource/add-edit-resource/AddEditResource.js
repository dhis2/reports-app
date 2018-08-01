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
        open: PropTypes.bool.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        selectedResource: PropTypes.object,
        isEditAction: PropTypes.bool,
    };

    static defaultProps = {
        selectedResource: null,
        isEditAction: false,
    };

    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(initialState));
    }
    componentDidMount() {
        if (this.props.selectedResource) {
            this.loadSelectedResource(this.props.selectedResource);
        } else if (!this.props.isEditAction) {
            this.state = JSON.parse(JSON.stringify(initialState));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedResource) {
            this.loadSelectedResource(nextProps.selectedResource);
        } else if (!nextProps.isEditAction) {
            this.state = JSON.parse(JSON.stringify(initialState));
        }
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

    getTypeForResource = () => {
        if (this.props.selectedResource) {
            return RESOURCE_TYPES.filter(obj => obj.id === this.state.resource.type);
        }
        return RESOURCE_TYPES;
    }

    getFileNameToDisplay = () => {
        if (this.state.selectedFileToUpload) {
            return this.state.selectedFileToUpload.name;
        } else if (this.props.selectedResource && !this.state.resource.external) {
            return this.state.resource.url;
        }
        return '';
    };

    /* load resource info to edit it */
    loadSelectedResource = (resource) => {
        const api = this.props.d2.Api.getApi();
        const url = `${DOCUMENTS_ENDPOINT}/${resource.id}`;
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    if (response.external === true) {
                        response.type = TYPES.EXTERNAL_URL;
                    } else {
                        response.type = TYPES.UPLOAD_FILE;
                    }
                    this.setState({
                        ...this.state,
                        resource: {
                            ...response,
                        },
                    });
                }
            }).catch(() => {
                // TODO: manage error
            });
        }
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
                }).catch((error) => {
                    this.props.onError(error);
                });
            }
        }
    };

    /* add document */
    addDocument = (fileResource) => {
        const api = this.props.d2.Api.getApi();
        const documentData = this.state.resource;
        if (this.state.resource.type === TYPES.UPLOAD_FILE && fileResource.name) {
            documentData.url = fileResource.name;
        }
        if (api) {
            if (this.state.resource.id) {
                api.update(`${DOCUMENTS_ENDPOINT}/${this.state.resource.id}`, documentData).then((response) => {
                    if (response) {
                        this.close(true);
                    }
                }).catch((error) => {
                    this.props.onError(error);
                });
            } else {
                api.post(DOCUMENTS_ENDPOINT, documentData).then((response) => {
                    if (response) {
                        this.close(true);
                    }
                }).catch((error) => {
                    this.props.onError(error);
                });
            }
        }
    };

    ifFormValid = () => true;

    /* close dialog */
    close = (refreshList) => {
        this.props.onRequestClose(refreshList);
    };

    displayUploadSection = () => (
        this.state.resource.type === TYPES.UPLOAD_FILE ?
            { display: 'block' } :
            { display: 'none' }
    );

    displayUrl = () => (
        this.state.resource.type === TYPES.UPLOAD_FILE ?
            { display: 'none' } :
            { display: 'block' }
    );

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
                onClick={
                    (this.state.resource.type === TYPES.UPLOAD_FILE && this.state.selectedFileToUpload) ?
                        this.addResource :
                        this.addDocument
                }
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
                            items={this.getTypeForResource()}
                            value={this.state.resource.type}
                            onChange={this.onChangeType}
                        />
                        {/* resource attachment */}
                        <div id={'upload_type_fields'} style={this.displayUploadSection()}>
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
                                    value={this.getFileNameToDisplay()}
                                    // eslint-disable-next-line
                                    onClick={() => this.fileInput.click()}
                                />
                            </div>
                        </div>
                        {/* url */}
                        <InputField
                            style={this.displayUrl()}
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
