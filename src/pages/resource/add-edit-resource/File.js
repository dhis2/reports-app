import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { File } from '../../../components/form/File'
import { isRequired } from '../../../utils/form/validators'

export const File = () => (
    <FormRow>
        <File
            name="file"
            placeholder={i18n.t('File')}
            fieldProps={{ validate: isRequired }}
        />
    </FormRow>
)

Name.propTypes = {
    isRequired: PropTypes.bool.isRequired,
}
