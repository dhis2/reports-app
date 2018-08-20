/* eslint-disable */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { i18nKeys } from '../../../i18n';
import { TYPES } from '../resource.conf';

import AddEditResource from './AddEditResource';

/* material-ui */
import { Dialog } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/* d2-ui */
import { SvgIcon, Button } from '@dhis2/d2-ui-core';

jest.mock('@dhis2/d2-ui-org-unit-tree', () => ({
    OrgUnitTree: ('OrgUnitTree'),
}));

import fakerData from '../../../helpers/fakerTests';

const mockResource = {
    created: "2012-11-13T13:14:26.466",
    lastUpdated: "2018-08-07T16:13:49.866",
    name: "DHIS 2 Home Page",
    href: "http://localhost:8080/api/29/documents/hKYLLpNinZR",
    id: "hKYLLpNinZR",
    displayName: "DHIS 2 Home Page",
    publicAccess: "rw------",
    url: "http://dhis2.org",
    externalAccess: false,
    external: true,
    type: TYPES.EXTERNAL_URL,
    attachment: false,
    favorite: false,
    lastUpdatedBy: {
        id: "xE7jOejl9FI"
    },
    access: {
        read: true,
        update: true,
        externalize: true,
        delete: true,
        write: true,
        manage: true
    },
    user: {
        id: "xE7jOejl9FI"
    },
    favorites: [],
    userGroupAccesses: [],
    attributeValues: [],
    translations: [],
    userAccesses: []
};

const ownShallow = (selectedResource) => {
    return shallow(
        <AddEditResource
            d2={fakerData.d2}
            onRequestClose={jest.fn()}
            updateAppState={jest.fn()}
            open={true}
            onError={jest.fn()}
            selectedResource={selectedResource}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

describe('Test <AddEditResource /> rendering:', () => {
    let wrapper;
    let dialog;
    beforeEach(() => {
        wrapper = ownShallow({ selectedResource: {resource: 'ResourceName', id: 'ResourceId' }});
        wrapper.setState({ resource: mockResource });
        dialog = wrapper.find(Dialog);
    });

    it('Should render Edit component without crashing', () => {
        ownShallow({ resource: 'ResourceName', id: 'ResourceId' });
    });

    it('Should render correct title when "Editing" a resource.', () => {
        expect(dialog.props().title).toBe(`${i18nKeys.resource.editResourceTitle}`);
    });

    /* name */
    it('Should display report "name" input with correct value.', () => {
        expect(dialog.find('[name="resourceName"]')).toHaveLength(1);
        expect(dialog.find('[name="resourceName"]').props().value).toBe(mockResource.name);
    });

    /* type */
    it('Should display "type" selector with correct value.', () => {
        expect(dialog.find('[name="resourceType"]')).toHaveLength(1);
        expect(dialog.find('[name="resourceType"]').props().value).toBe(mockResource.type);
    });

    /* resource attachment */
    it('Should display "resourceAttachment" checkbox.', () => {
        expect(dialog.find('#resourceAttachment')).toHaveLength(1);
        expect(dialog.find('#resourceAttachment').props().checked).toBe(mockResource.attachment);
    });

    /* file upload attachment */
    it('Should allow to upload resource file when type is "UPLOAD_FILE".', () => {
        expect(dialog.find(SvgIcon)).toHaveLength(1);
        expect(dialog.find('[name="fileName"]')).toHaveLength(1);
    });

    /* url */
    it('Should allow to insert an external URL to the resource "EXTERNAL_URL".', () => {
        expect(dialog.find('[name="resourceUrl"]')).toHaveLength(1);
        expect(dialog.find('[name="resourceUrl"]').props().value).toBe(mockResource.url);
    });

    /* Hide Upload Section */
    it('Should not show upload section when resource is external url.', () => {
        expect(dialog.find('#upload_type_fields')).toHaveLength(1);
        expect(dialog.find('#upload_type_fields').props().style.display).toBe('none');
    });

    /* Show Upload Section */
    it('Should show upload section when resource is upload.', () => {
        expect(dialog.find('#upload_type_fields')).toHaveLength(1);
        wrapper.setState({ resource: { ...mockResource, type: TYPES.UPLOAD_FILE}});
        dialog = wrapper.find(Dialog);
        expect(dialog.find('#upload_type_fields').props().style.display).toBe('block');
    });

});

describe('Test <AddEditResource /> actions:', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow({ selectedResource: {resource: 'ResourceName', id: 'ResourceId' }});
    });

    /* should load selected report when one selected */
    it('Should call loadReportTables when mount.', () => {
        const wrapper = ownShallow({ selectedResource: {resource: 'ResourceName', id: 'ResourceId' }});
        wrapper.instance().loadSelectedResource = jest.fn();
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().loadSelectedResource).toHaveBeenCalled();
    });

    it('Should call onChangeName when input name value changes.', () => {
        wrapper.instance().onChangeName = jest.fn();
        wrapper.setState({ resource: mockResource });
        wrapper.find('[name="resourceName"]').simulate('change', 'newName');
        expect(wrapper.instance().onChangeName).toHaveBeenCalled();
    });

    it('Should call onChangeType when select type value changes.', () => {
        wrapper.instance().onChangeType = jest.fn();
        wrapper.setState({ resource: mockResource });
        wrapper.find('[name="resourceType"]').simulate('change', 'newType');
        expect(wrapper.instance().onChangeType).toHaveBeenCalled();
    });

    it('Should call onChangeAttachment when checkbox value changes.', () => {
        wrapper.instance().onChangeAttachment = jest.fn();
        wrapper.setState({ resource: mockResource });
        wrapper.find('#resourceAttachment').simulate('change');
        expect(wrapper.instance().onChangeAttachment).toHaveBeenCalled();
    });

    it('Should call onChangeFileResource when upload file changes.', () => {
        wrapper.instance().onChangeFileResource = jest.fn();
        wrapper.setState({ resource: { ...mockResource, type: TYPES.UPLOAD_FILE }});
        wrapper.find('[type="file"]').simulate('change');
        expect(wrapper.instance().onChangeFileResource).toHaveBeenCalled();
    });

    it('Should call onChangeUrl when external url changes.', () => {
        wrapper.instance().onChangeUrl = jest.fn();
        wrapper.setState({ resource: { ...mockResource, type: TYPES.EXTERNAL_URL }});
        wrapper.find('[name="resourceUrl"]').simulate('change');
        expect(wrapper.instance().onChangeUrl).toHaveBeenCalled();
    });

    it('Should return correct types to resource type selection.', () => {
        let type = wrapper.instance().getTypeForResource();
        expect(type).toEqual([ { id: 'UPLOAD_FILE', name: 'Upload File', external: false } ]);
        wrapper.setState({ resource: { ...mockResource, type: TYPES.EXTERNAL_URL }});
        type = wrapper.instance().getTypeForResource();
        expect(type).toEqual([ { id: 'EXTERNAL_URL', name: 'External URL', external: true } ]);
    });

    it('Should have a getFileNameToDisplay function.', () => {
        expect(wrapper.instance().getFileNameToDisplay).toBeDefined();
        expect(typeof wrapper.instance().getFileNameToDisplay).toBe('function');
    });

    it('Should have a getTitle function.', () => {
        expect(wrapper.instance().getTitle).toBeDefined();
        expect(typeof wrapper.instance().getTitle).toBe('function');
    });

    it('Should have a close function.', () => {
        expect(wrapper.instance().close).toBeDefined();
        expect(typeof wrapper.instance().close).toBe('function');
    });

    it('Should call addResource function when save button is clicked and type is UPLOAD_FILE.', () => {
        expect(wrapper.instance().addResource).toBeDefined();
        expect(typeof wrapper.instance().addResource).toBe('function');
        wrapper.instance().addResource = jest.fn();
        wrapper.setState({ resource: { ...mockResource, type: TYPES.UPLOAD_FILE }, selectedFileToUpload: 'file' });
        const actions = mount(<MuiThemeProvider><span>{wrapper.find(Dialog).props().actions}</span></MuiThemeProvider>);
        actions.find(Button).at(1).find('button').simulate('click');
        expect(wrapper.instance().addResource).toHaveBeenCalled();
    });

    it('Should call addDocument function when save button is clicked and type is EXTERNAL_URL.', () => {
        expect(wrapper.instance().addDocument).toBeDefined();
        expect(typeof wrapper.instance().addDocument).toBe('function');
        wrapper.instance().addDocument = jest.fn();
        wrapper.setState({ resource: { ...mockResource, type: TYPES.HTML }, selectedFileToUpload: 'file' });
        const actions = mount(<MuiThemeProvider><span>{wrapper.find(Dialog).props().actions}</span></MuiThemeProvider>);
        actions.find(Button).at(1).find('button').simulate('click');
        expect(wrapper.instance().addDocument).toHaveBeenCalled();
    });

    it('Should call updateDocument function when editing a document.', () => {
        wrapper.instance().updateDocument = jest.fn();
        wrapper.setState({ resource: { ...mockResource, type: TYPES.HTML }, selectedFileToUpload: 'file' });
        wrapper.instance().addDocument();
        expect(wrapper.instance().updateDocument).toHaveBeenCalled();
    });

    it('Should call postDocument function when creating a document.', () => {
        wrapper.instance().postDocument = jest.fn();
        wrapper.setState({ resource: { ...mockResource, id: null }, selectedFileToUpload: 'file' });
        wrapper.instance().addDocument();
        expect(wrapper.instance().postDocument).toHaveBeenCalled();
    });

    it('Should validate form.', () => {
        expect(wrapper.instance().ifFormValid()).toBe(false);
        wrapper.setState({ resource: mockResource });
        expect(wrapper.instance().ifFormValid()).toBe(true);
    });

});
