import React from 'react';

export default React.createContext({
    d2: null,
    i18n: null,
    currentSection: '',
    showSnackbar: false,
    snackbarConf: {
        type: '',
        message: '',
    },
});
