import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Select } from '../../../components/form/Select'
import { isRequired } from '../../../utils/form/validators'
import { resourceTypeOptions } from '../../../utils/resource/constants'

export const Type = () => (
    <FormRow>
        <Field
            name="type"
            placeholder={i18n.t('Resource Type')}
            options={resourceTypeOptions}
            showErrorText={false}
            component={Select}
            disabled={disabled}
        />
    </FormRow>
)

Type.propTypes = {
    disabled: PropTypes.bool,
}

Type.defaultProps = {
    disabled: false,
}
