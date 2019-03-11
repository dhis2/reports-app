import React from 'react'
import { children } from '../../utils/react/propTypes'

export const FormRow = props => (
    <React.Fragment>
        <div>{props.children}</div>

        <style jsx>{`
            div {
                margin-bottom: 20px;
            }
        `}</style>
    </React.Fragment>
)

FormRow.propTypes = {
    children: children.isRequired,
}
