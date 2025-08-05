import PropTypes from 'prop-types'
import styles from './ReportTable.module.css'

export const Row = ({ cells }) => (
    <tr className={styles.bodyRow}>
        {cells.map((cell, index) => (
            <td
                key={`c-${cell}-${index}`}
                className={`${styles.cell} ${index !== 0 ? styles.centered : ''}`}
            >
                {cell}
            </td>
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
        <table className={styles.table}>
            <thead>
                <tr className={styles.headerRow}>
                    {headers.map((header, index) => (
                        <th
                            key={`h-${header}-${index}`}
                            className={`${styles.headerCell} ${
                                index !== 0 ? styles.centered : ''
                            }`}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
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
