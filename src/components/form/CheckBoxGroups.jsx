import FormHelperText from '@material-ui/core/FormHelperText'
import PropTypes from 'prop-types'
import React from 'react'
import { Field } from 'react-final-form'
import { CheckBoxes } from './CheckBoxes.jsx'

export const CheckBoxGroups = (props) => (
    <div className="row">
        {props.displayError && (
            <div className="col-xs-12">
                <Field type="checkbox" name={props.name}>
                    {({ meta }) => (
                        <FormHelperText>
                            {meta.error && meta.touched ? meta.error : ''}
                        </FormHelperText>
                    )}
                </Field>
            </div>
        )}

        {props.groups.map((group) => (
            <div
                key={group.label}
                className="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            >
                <CheckBoxes
                    name={props.name}
                    label={group.label}
                    options={group.options}
                    showError={false}
                />
            </div>
        ))}
    </div>
)

CheckBoxGroups.propTypes = {
    groups: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    displayError: PropTypes.bool,
}

CheckBoxGroups.defaultProps = {
    displayError: true,
}
