import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { File as FileInput } from '../../../../components/form/File'
import { FormRow } from '../../../../components/form/FormRow'
import { isRequired } from '../../../../utils/form/validators'

export const File = props => (
    <FormRow>
        <FileInput
            name="file"
            placeholder={i18n.t('File')}
            fieldProps={props.isRequired ? { validate: isRequired } : {}}
        />
    </FormRow>
)

File.propTypes = {
    isRequired: PropTypes.bool.isRequired,
}
