export const LEFT_BART_WIDTH = 295;
export const HEADER_HEIGHT = '4rem';
export const MAX_WIDTH = 1400;
export const CONTENT_AREA_PADDING = 20;
export const PRIMARY_COLOR = '#004ba0';

const styles = {
    container: {
        padding: 16,
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
    feedbackSnackBar: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
    },
    actionButton: {
        marginRight: 16,
    },
};

export default styles;
