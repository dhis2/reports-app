const MenuGridStyle = {
    section: {
        display: 'inline-block',
        position: 'relative',
        minWidth: '200px',
        minHeight: '218px',
        height: '100%',
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingBottom: '20px',
        backgroundColor: '#ffffff',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        borderRadius: '5px',
    },
    sectionTitleBar: {
        marginTop: '28px',
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
        marginTop: '38px',
        marginBottom: '38px',
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
