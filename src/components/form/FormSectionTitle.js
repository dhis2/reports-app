import React from 'react'
import { children } from '../../utils/react/propTypes'

export const FormSectionTitle = ({ children }) => (
    <h2>
        {children}
        <style jsx>{`
            h2 {
                color: black;
                font-weight: bold;
                font-size: 1.3em;
                line-height: 2;
                margin: 0 0 10px;
            }
        `}</style>
    </h2>
)

FormSectionTitle.propTypes = {
    children: children.isRequired,
}
