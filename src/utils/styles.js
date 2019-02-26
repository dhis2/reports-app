import menuGrid from './styles/menu-element'

const LEFT_BART_WIDTH = 295
const HEADER_HEIGHT = '4rem'
const MAX_WIDTH = 1400
const CONTENT_AREA_PADDING = 20
const PAGING_BOTTOM_MARGIN = 60
export const PRIMARY_COLOR = '#004ba0'

const styles = {
    container: {
        padding: 16,
    },
    downloadLink: {
        marginRight: '10px',
    },
    dialogBtn: {
        marginRight: '10px',
    },
    addButton: {
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
    },
    leftBar: {
        width: LEFT_BART_WIDTH,
        position: 'fixed',
        bottom: 0,
        top: 0,
        left: 0,
        paddingTop: HEADER_HEIGHT,
    },
    contentWrapper: {
        marginLeft: 295,
        maxWidth: MAX_WIDTH,
    },
    contentArea: {
        paddingTop: HEADER_HEIGHT,
        paddingBottom: CONTENT_AREA_PADDING,
        paddingLeft: CONTENT_AREA_PADDING,
        paddingRight: CONTENT_AREA_PADDING,
    },
    loadingContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 3000, // over dialog
    },
    feedbackSnackBar: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    marginForAddButton: {
        marginBottom: PAGING_BOTTOM_MARGIN,
    },
    formLabel: {
        textAlign: 'left',
        color: '#757575',
        marginBottom: 5,
        fontSize: '14px',
    },
    actionsContainer: {
        display: 'block',
        marginTop: 48,
        marginBotton: 16,
    },
    dropdowns: {
        margin: 0,
    },
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
        marginLeft: 8,
    },
    actionButton: {
        marginRight: 16,
    },
    error: {
        color: '#f44336',
    },
    helpLink: {
        paddingLeft: '12px',
        color: '#276696',
        textDecoration: 'none',
    },
    parsedPeriod: {
        marginBottom: '16px',
    },
}

export default {
    ...styles,
    menuGrid,
}
