import i18n from '@dhis2/d2-i18n'
import { Card, CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { SectionHeadline } from '../../components/SectionHeadline.js'
import { RESOURCE_SECTION_KEY } from '../../config/sections.config.js'
import {
    loadResource,
    addNewResource,
    updateResource,
    backToList,
} from '../../redux/actions/resource.js'
import { resourceTypeOptions } from '../../utils/resource/constants.js'
import { formCard, formLoader } from '../../utils/styles/shared.js'
import { ResourceForm } from './add-edit-resource/ResourceForm.js'
import { extractFileAndFormattedResource } from './helper.js'

class AddEditResource extends Component {
    componentDidMount() {
        if (!this.isResourceLoaded()) {
            this.props.loadResource(this.getResourceIdFromUrl())
        }
    }

    onSubmit = (values) => {
        const { file, resource } = extractFileAndFormattedResource(values)
        const submitHandler = this.isEdit()
            ? this.props.updateResource
            : this.props.addNewResource

        submitHandler(resource, file)
        this.props.backToList()
    }

    getInitialValues() {
        const { resource } = this.props
        return this.isEdit()
            ? {
                  name: resource.displayName,
                  type: resourceTypeOptions[resource.external ? 0 : 1].value,
                  attachment: resource.attachment ? 'yes' : 'no',
                  url: resource.url,
              }
            : {
                  name: '',
                  type: resourceTypeOptions[1].value,
                  attachment: 'no',
              }
    }

    isEdit() {
        return this.props.match.params.mode === 'edit'
    }

    isResourceLoaded() {
        return !(this.isEdit() && !this.props.resource.id)
    }

    isEditingFileResource() {
        return this.isEdit() && !this.props.resource.external
    }

    getResourceIdFromUrl() {
        return this.props.match.params.id
    }

    getFormTexts(isEdit) {
        const editTitle = i18n.t('Edit resource')
        const editSubmitLabel = i18n.t('Save resource')
        const addText = i18n.t('Add resource')

        return {
            title: isEdit ? editTitle : addText,
            submitLabel: isEdit ? editSubmitLabel : addText,
        }
    }

    render() {
        const isEdit = this.isEdit()
        const { title, submitLabel } = this.getFormTexts(isEdit)

        return (
            <Fragment>
                <SectionHeadline
                    label={title}
                    showBackButton={true}
                    onBackClick={this.props.backToList}
                    sectionKey={RESOURCE_SECTION_KEY}
                />
                <Card className={formCard.className}>
                    {this.isResourceLoaded() ? (
                        <ResourceForm
                            open={true}
                            title={title}
                            isFileRequired={!isEdit}
                            onSubmitLabel={submitLabel}
                            initialValues={this.getInitialValues()}
                            onSubmit={this.onSubmit}
                            onCancel={this.props.backToList}
                            isEditingFileResource={this.isEditingFileResource()}
                        />
                    ) : (
                        <div className={formLoader.className}>
                            <CircularProgress />
                        </div>
                    )}
                </Card>
                {formCard.styles}
                {formLoader.styles}
            </Fragment>
        )
    }
}

AddEditResource.propTypes = {
    addNewResource: PropTypes.func.isRequired,
    backToList: PropTypes.func.isRequired,
    loadResource: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            mode: PropTypes.oneOf(['new', 'edit']).isRequired,
            id: PropTypes.string,
        }).isRequired,
    }).isRequired,
    resource: PropTypes.object.isRequired,
    updateResource: PropTypes.func.isRequired,
}

const ConnectedAddEditResource = connect(
    (state) => ({
        resource: state.resource.selectedResource,
    }),
    {
        loadResource,
        updateResource,
        addNewResource,
        backToList,
    }
)(AddEditResource)

export {
    ConnectedAddEditResource as AddEditResource,
    AddEditResource as AddEditResourceComponent,
}
