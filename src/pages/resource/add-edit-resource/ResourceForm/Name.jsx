import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Field } from 'react-final-form'
import { FormRow } from '../../../../components/form/FormRow.jsx'
import { Input } from '../../../../components/form/Input.jsx'
import { isRequired } from '../../../../utils/form/validators.js'

export const Name = () => (
    <FormRow>
        <Field
            name="name"
            placeholder={i18n.t('Name*')}
            component={Input}
            validate={isRequired}
        />
    </FormRow>
)
