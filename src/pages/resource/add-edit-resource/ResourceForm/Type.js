import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Field } from 'react-final-form'
import { FormRow } from '../../../../components/form/FormRow'
import { Select } from '../../../../components/form/Select'
import { resourceTypeOptions } from '../../../../utils/resource/constants'

export const Type = (props) => (
    <FormRow>
        <Field
            name="type"
            placeholder={i18n.t('Resource Type')}
            options={resourceTypeOptions}
            showErrorText={false}
            component={Select}
            disabled={props.disabled}
        />
    </FormRow>
)

Type.propTypes = {
    disabled: PropTypes.bool,
}

Type.defaultProps = {
    disabled: false,
}
