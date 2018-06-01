const MenuGridStyle = {
    elementContainer: {
        marginBottom: '8px',
        '& a': {
            textDecoration: 'none !important',
        },
    },
    element: {
        minWidth: '200px',
        minHeight: '218px',
        paddingLeft: '38px',
        paddingRight: '38px',
        marginBottom: '8px',
        backgroundColor: '#ffffff !important',
        boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25) !important',
        borderRadius: '5px !important',
    },
    elementTitleBar: {
        position: 'relative',
        marginTop: '30px',
        height: '42px',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionName: {
        fontSize: '24px',
        textAlign: 'left',
        color: '#000000',
    },
    sectionIcon: {
        float: 'right',
        color: '#757575 !important',
        fontSize: '50px !important',
    },
    sectionDescription: {
        fontSize: '14px',
        textAlign: 'left',
        color: '#757575',
        marginTop: '42px',
        marginBottom: '35px',
        display: 'block',
    },
    sectionActionText: {
        position: 'absolute',
        bottom: '20px',
        display: 'block',
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'left',
        color: '#2196f3',
    },
};

export default MenuGridStyle;
