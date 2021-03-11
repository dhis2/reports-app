import FormControl from '@material-ui/core/FormControl'
import MUIInput from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'
import React from 'react'
import { formInput, formInputMeta } from '../../utils/react/propTypes'
import { ErrorText } from './buildingBlocks/ErrorText'
import { HelpText } from './buildingBlocks/HelpText'
import { inputWrapper } from './styles'

export const Input = props => (
    <React.Fragment>
        <FormControl className={inputWrapper.className}>
            <InputLabel htmlFor={props.input.name}>
                {props.placeholder}
            </InputLabel>
            <MUIInput {...props.input} label={props.placeholder} />
            {props.helpText && <HelpText>{props.helpText}</HelpText>}
            <ErrorText
                error={props.meta.error || ''}
                touched={props.meta.touched}
            />
        </FormControl>

        {inputWrapper.styles}
    </React.Fragment>
)

Input.propTypes = {
    input: formInput.isRequired,
    meta: formInputMeta.isRequired,
    placeholder: PropTypes.string.isRequired,
    helpText: PropTypes.string,
}
