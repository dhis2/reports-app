import React from 'react';

export default React.createContext({
    d2: null,
    currentSection: '',
    showSnackbar: false,
    snackbarConf: {
        type: '',
        message: '',
    },
});
