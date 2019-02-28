/* React */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Header = (header, index) => <th key={`h-${header}-${index}`}>{header}</th>
const Cell = (cell, index) => <td key={`c-${cell}-${index}`}>{cell}</td>
const Row = (rowItems, index) => (
    <tr key={`r-${rowItems[0]}-${index}`}>{rowItems.map(Cell)}</tr>
)

const ReportTable = ({ content: { title, headers, rows } }) => (
    <Fragment>
        <h1>{title}</h1>
        <table>
            <thead>
                <tr className="tabular-report__header-row">
                    {headers.map(Header)}
                </tr>
            </thead>
            <tbody className={'tabular-report__table-body'}>
                {rows.map(Row)}
            </tbody>
        </table>
    </Fragment>
)

ReportTable.propTypes = {
    content: PropTypes.object.isRequired,
}

export default ReportTable
