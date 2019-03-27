/* React */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

export const Row = ({ cells }) => (
    <tr>
        {cells.map((cell, index) => (
            <td key={`c-${cell}-${index}`}>{cell}</td>
        ))}
    </tr>
)

Row.propTypes = {
    cells: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
}

const ReportTable = ({ content: { title, headers, rows } }) => (
    <Fragment>
        <h1>{title}</h1>
        <table>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={`h-${header}-${index}`}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((cells, index) => (
                    <Row cells={cells} key={`r-${cells[0]}-${index}`} />
                ))}
            </tbody>
        </table>
        <style jsx>{`
            table {
                border-collapse: collapse;
            }
            thead tr {
                border-bottom: 2px solid #e0e0e0;
            }
            tbody :global(tr) {
                border-bottom: 1px solid #e0e0e0;
            }
            th,
            tbody :global(td) {
                border: none;
                font-size: 14px;
                padding: 16px 16px;
            }
            table th {
                text-align: left;
                font-weight: bold;
            }
            tbody :global(td):not(:first-child),
            thead :global(th):not(:first-child) {
                text-align: center;
            }
        `}</style>
    </Fragment>
)

ReportTable.propTypes = {
    content: PropTypes.object.isRequired,
}

export default ReportTable
