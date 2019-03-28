import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { FormRow } from '../../../../components/form/FormRow'
import { RadioButtons } from '../../../../components/form/RadioButtons'

export const Attachment = () => (
    <FormRow>
        <p>{i18n.t('Do you want to use this file as an attachment?')}</p>
        <RadioButtons
            name="attachment"
            options={[
                { value: 'yes', label: i18n.t('Yes') },
                { value: 'no', label: i18n.t('No') },
            ]}
            showError={false}
        />
        <style jsx>{`
            p {
                margin-top: 0;
            }
        `}</style>
    </FormRow>
)
