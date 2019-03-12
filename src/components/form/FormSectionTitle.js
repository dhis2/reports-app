import React from 'react'
import css from 'styled-jsx/css'

import { children } from '../../utils/react/propTypes'

const style = css`
    h2 {
        color: black;
        font-weight: bold;
        font-size: 1.3em;
        line-height: 2;
        margin: 0 0 10px;
    }
`

export const FormSectionTitle = ({ children }) => (
    <h2>
        {children}
        <style jsx>{style}</style>
    </h2>
)

FormSectionTitle.propTypes = {
    children: children.isRequired,
}
