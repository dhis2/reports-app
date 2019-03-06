import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { CheckBoxes } from './CheckBoxes'
import FormHelperText from '@material-ui/core/FormHelperText'

export const CheckBoxGroups = props => (
    <div className="row">
        <div className="col-xs-12">
            <Field type="checkbox" name={props.name}>
                {({ meta }) => (
                    <FormHelperText>
                        {meta.error && meta.touched ? meta.error : ''}
                    </FormHelperText>
                )}
            </Field>
        </div>

        {props.groups.map(group => (
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
    name: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
}
