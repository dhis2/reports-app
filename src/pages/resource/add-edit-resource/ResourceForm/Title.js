import PropTypes from 'prop-types'
import React from 'react'
import { FormSectionTitle } from '../../../../components/form/FormSectionTitle.js'

export const Title = (props) => (
    <FormSectionTitle>{props.label}</FormSectionTitle>
)

Title.propTypes = {
    label: PropTypes.string.isRequired,
}
