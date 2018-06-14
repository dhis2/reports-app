export const LEFT_BART_WIDTH = 295;
export const HEADER_HEIGHT = '4rem';
export const MAX_WIDTH = 1400;
export const CONTENT_AREA_PADDING = 20;
export const PRIMARY_COLOR = '#004ba0';

const styles = {
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
};

export default styles;
