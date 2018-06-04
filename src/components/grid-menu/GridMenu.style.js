const MenuGridStyle = {
    elementContainer: {
        marginBottom: '8px',
        '& a': {
            textDecoration: 'none !important',
        },
    },
    element: {
        display: 'inline-block',
        position: 'relative',
        minWidth: '200px',
        minHeight: '218px',
        height: '100%',
        paddingLeft: '38px',
        paddingRight: '38px',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
        borderRadius: '5px',
    },
    elementTitleBar: {
        marginTop: '30px',
        minHeight: '42px',
        flexWrap: 'nowrap',
        display: 'flex',
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
        color: '#757575',
        fontSize: '50px',
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
