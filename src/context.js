import React from 'react';

export default React.createContext({
    d2: null,
    updateAppState: null,
    i18n: null,
    currentSection: '',
    showSnackbar: false,
    snackbarConf: {
        type: '',
        message: '',
    },
});
