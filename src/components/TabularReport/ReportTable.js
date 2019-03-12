/* React */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Row = ({ cells }) => (
    <tr>
        {cells.map((cell, index) => (
            <td key={`c-${cell}-${index}`}>{cell}</td>
        ))}
    </tr>
)

Row.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const ReportTable = ({ content: { title, headers, rows } }) => (
    <Fragment>
        <h1>{title}</h1>
        <table>
            <thead>
                <tr className="tabular-report__header-row">
                    {headers.map((header, index) => (
                        <th key={`h-${header}-${index}`}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className={'tabular-report__table-body'}>
                {rows.map((cells, index) => (
                    <Row cells={cells} key={`r-${cells[0]}-${index}`} />
                ))}
            </tbody>
        </table>
    </Fragment>
)

ReportTable.propTypes = {
    content: PropTypes.object.isRequired,
}

export default ReportTable
