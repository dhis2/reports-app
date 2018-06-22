/* styles */
import { PRIMARY_COLOR } from '../../styles';

const DataSetReport = {
    hideOptions: {
        display: 'none',
    },
    showOptions: {
        display: 'block',
    },
    showMoreOptionsButton: {
        display: 'block',
        cursor: 'pointer',
        color: PRIMARY_COLOR,
        marginTop: 5,
        marginBottom: 5,
        outline: 'none',
    },
    backButton: {
        cursor: 'pointer',
        outline: 'none',
    },
    downloadContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    downloadButton: {
        cursor: 'pointer',
        outline: 'none',
        color: '#757575',
        fontSize: 12,
        textTransform: 'uppercase',
    },
};

export default DataSetReport;
