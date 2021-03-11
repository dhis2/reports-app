import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Field } from 'react-final-form'
import { FormRow } from '../../../../components/form/FormRow'
import { Input } from '../../../../components/form/Input'
import { isRequired } from '../../../../utils/form/validators'

export const Url = () => (
    <FormRow>
        <Field
            name="url"
            placeholder={i18n.t('Url*')}
            component={Input}
            validate={isRequired}
        />
    </FormRow>
)
