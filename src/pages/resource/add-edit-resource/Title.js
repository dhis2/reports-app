import React from 'react'
import PropTypes from 'prop-types'
import { FormSectionTitle } from '../../../components/form/FormSectionTitle'

export const Title = props => <FormSectionTitle>{props.label}</FormSectionTitle>

Title.propTypes = {
    label: PropTypes.string.isRequired,
}
