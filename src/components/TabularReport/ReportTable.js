/* React */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Header = (header, index) => <th key={index}>{header}</th>
const Cell = (cell, index) => <td key={index}>{cell}</td>
const Row = (rowItems, index) => <tr key={index}>{rowItems.map(Cell)}</tr>

const ReportTable = ({ content: { title, headers, rows } }) => (
    <Fragment>
        <h1>{title}</h1>
        <table>
            <thead>
                <tr>{headers.map(Header)}</tr>
            </thead>
            <tbody>{rows.map(Row)}</tbody>
        </table>
    </Fragment>
)

ReportTable.propTypes = {
    content: PropTypes.object.isRequired,
}

export default ReportTable
