//------------------------------------------------------------------------------
// <auto-generated>
// This code was generated by d2-i18n-generate.
//
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
import i18n from '@dhis2/d2-i18n'
import moment from 'moment'
import 'moment/locale/pt'
import 'moment/locale/ur'

import enTranslations from './en/translations.json'
import ptTranslations from './pt/translations.json'
import urTranslations from './ur/translations.json'

const namespace = 'reports-app'
moment.locale('en')

i18n.addResources('en', namespace, enTranslations)
i18n.addResources('pt', namespace, ptTranslations)
i18n.addResources('ur', namespace, urTranslations)

i18n.setDefaultNamespace(namespace)
i18n.changeLanguage('en')

export default i18n
