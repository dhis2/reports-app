/* React */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

/* material-ui */
import { Dialog } from 'material-ui';
import SelectFieldMui from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/* d2-ui */
import { Button, InputField, SelectField, CheckBox, SvgIcon, TextField } from '@dhis2/d2-ui-core';

/* Redux */
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../../redux/actions/feedback';
import { LOADING } from '../../../utils/feedbackSnackBarTypes';

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
    loading: false,
};

export default class AddEditResource extends PureComponent {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        selectedResource: PropTypes.object,
        updateFeedbackState: PropTypes.func.isRequired,
    };

    static defaultProps = {
        selectedResource: null,
    };

    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(initialState));
    }

    componentDidMount() {
        if (this.props.selectedResource) {
            this.loadSelectedResource(this.props.selectedResource);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedResource && !this.state.loading) {
            this.loadSelectedResource(nextProps.selectedResource);
        }
        this.setState({ selectedFileToUpload: null });
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

    /**
     * When editing a resource user cannot change it's type, soo we return an array only with the selected resource type
     */
    getTypeForResource = () => {
        if (this.props.selectedResource) {
            return RESOURCE_TYPES.filter(obj => obj.id === this.state.resource.type);
        }
        return RESOURCE_TYPES;
    };

    getFileNameToDisplay = () => {
        if (this.state.selectedFileToUpload) {
            return this.state.selectedFileToUpload.name;
        } else if (this.props.selectedResource && !this.state.resource.external) {
            return this.state.resource.url;
        }
        return '';
    };

    getTitle = () => (this.props.selectedResource ?
        i18n.t(i18nKeys.resource.editResourceTitle) :
        i18n.t(i18nKeys.resource.addNewResourceTitle));

    getTypeDropdownComponent = () => (this.getTypeForResource().length > 1 ?
        (
            <SelectField
                style={styles.width100}
                name={'resourceType'}
                label={i18n.t(i18nKeys.resource.typeLabel)}
                items={this.getTypeForResource()}
                value={this.state.resource.type}
                onChange={this.onChangeType}
                disabled={Boolean(true)}
            />
        ) : (
            <SelectFieldMui
                floatingLabelText={i18n.t(i18nKeys.resource.typeLabel)}
                value={this.state.resource.type}
                name={'resourceType'}
                onChange={this.onChangeType}
                fullWidth
                disabled
            >
                <MenuItem
                    value={this.state.resource.type}
                    primaryText={this.getTypeForResource()[0].name}
                />
            </SelectFieldMui>
        ));

    /* close dialog */
    close = (refreshList) => {
        this.setState({ resource: JSON.parse(JSON.stringify(initialState.resource)) });
        this.props.onRequestClose(refreshList);
    };

    /* load resource info to edit it */
    loadSelectedResource = (resource) => {
        const api = this.props.d2.Api.getApi();
        const url = `${DOCUMENTS_ENDPOINT}/${resource.id}`;
        if (api) {
            this.props.updateFeedbackState(true, { type: LOADING });
            this.setState({ loading: true });
            api.get(url).then((response) => {
                if (response) {
                    this.props.updateFeedbackState(false);

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
            }).catch((error) => {
                this.props.onError(error);
            }).finally(() => {
                this.setState({ loading: false });
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
                this.props.updateFeedbackState(true, { type: LOADING });
                this.setState({ loading: true });
                api.post(FILE_RESOURCES_ENDPOINT, formData).then((response) => {
                    if (response.response) {
                        this.addDocument(response.response.fileResource);
                    }
                }).catch((error) => {
                    this.props.onError(error);
                }).finally(() => {
                    this.setState({ loading: false });
                });
            }
        }
    };

    /* add document */
    addDocument = (fileResource) => {
        const api = this.props.d2.Api.getApi();
        const documentData = JSON.parse(JSON.stringify(this.state.resource));
        if (this.state.resource.type === TYPES.UPLOAD_FILE && fileResource.name) {
            documentData.url = fileResource.name;
        } else if (this.state.resource.type === TYPES.EXTERNAL_URL && !this.state.resource.url.startsWith('http://') && !this.state.resource.url.startsWith('https://')) {
            documentData.url = `http://${documentData.url}`;
        }
        if (api) {
            if (this.state.resource.id) {
                this.updateDocument(api, documentData);
            } else {
                this.postDocument(api, documentData);
            }
        }
    };

    updateDocument = (api, documentData) => {
        if (!this.state.loading) {
            this.props.updateFeedbackState(true, { type: LOADING });
            this.setState({ loading: true });
        }
        api.update(`${DOCUMENTS_ENDPOINT}/${this.state.resource.id}`, documentData).then((response) => {
            if (response) {
                this.close(true);
            }
        }).catch((error) => {
            this.props.onError(error);
        }).finally(() => {
            this.setState({ loading: false });
        });
    };

    postDocument = (api, documentData) => {
        if (!this.state.loading) {
            this.props.updateFeedbackState(true, { type: LOADING });
            this.setState({ loading: true });
        }
        api.post(DOCUMENTS_ENDPOINT, documentData).then((response) => {
            if (response) {
                this.close(true);
            }
        }).catch((error) => {
            this.props.onError(error);
        }).finally(() => {
            this.setState({ loading: false });
        });
    };

    ifFormValid = () => {
        if (this.isNullOrWhiteSpace(this.state.resource.name)) {
            return false;
        }
        switch (this.state.resource.type) {
            case TYPES.UPLOAD_FILE:
                return this.validateUploadType();
            case TYPES.EXTERNAL_URL:
                return !this.isNullOrWhiteSpace(this.state.resource.url);
            default:
                return true;
        }
    };

    isNullOrWhiteSpace = str => (!str || str.length === 0 || /^\s*$/.test(str));

    validateUploadType = () => !(!this.props.selectedResource &&
        (!this.state.selectedFileToUpload || !this.state.selectedFileToUpload.name));

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
            <span id={'cancel-action-btn-id'}>
                <Button
                    key={'close-btn-key'}
                    style={appStyles.dialogBtn}
                    onClick={this.close}
                    disabled={this.state.loading}
                >
                    {i18n.t(i18nKeys.buttons.cancel)}
                </Button>
            </span>,
            <span id={'save-action-btn-id'}>
                <Button
                    key={'save-btn-key'}
                    raised
                    color={'primary'}
                    style={appStyles.dialogBtn}
                    disabled={!this.ifFormValid() || this.state.loading}
                    onClick={
                        (this.state.resource.type === TYPES.UPLOAD_FILE && this.state.selectedFileToUpload) ?
                            this.addResource :
                            this.addDocument
                    }
                >
                    {i18n.t(i18nKeys.buttons.save)}
                </Button>
            </span>,
        ];

        return (
            <Dialog
                autoDetectWindowHeight
                autoScrollBodyContent
                title={this.getTitle()}
                actions={actions}
                modal
                contentStyle={styles.dialog}
                open={this.props.open}
            >
                <div id={'add-edit-resource-form-id'}>
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
                            {
                                this.getTypeDropdownComponent()
                            }
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
                                    name={'hiddenInputFile'}
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
                </div>
            </Dialog>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
});

export const ConnectedAddEditResource = connect(
    null,
    mapDispatchToProps,
)(AddEditResource);
