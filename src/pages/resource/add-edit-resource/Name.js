import { Field } from 'react-final-form'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { FormRow } from '../../../components/form/FormRow'
import { Input } from '../../../components/form/Input'
import { isRequired } from '../../../utils/form/validators'

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
