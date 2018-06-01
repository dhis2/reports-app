const LEFT_BAR_WIDTH = 295;
const MAX_WIDTH = 1400;
const HEADER_HEIGHT = '3rem';
const CONTENT_MARGIN_TOP = '4rem'; // Header height plus 1
const CONTENT_AREA_PADDING = 20;

const styles = {
    leftBar: {
        width: LEFT_BAR_WIDTH,
        position: 'fixed',
        bottom: 0,
        top: 0,
        left: 0,
        paddingTop: HEADER_HEIGHT,
    },
    contentWrapper: {
        marginLeft: LEFT_BAR_WIDTH,
        maxWidth: MAX_WIDTH,
    },
    contentArea: {
        paddingTop: CONTENT_MARGIN_TOP,
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
};

export default styles;
