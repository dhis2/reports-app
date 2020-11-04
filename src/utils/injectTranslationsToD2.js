import i18n from '../locales'

const d2UiTranslations = {
    settings: i18n.t('Settings'),
    app_search_placeholder: i18n.t('Search apps'),
    profile: i18n.t('Profile'),
    account: i18n.t('Account'),
    help: i18n.t('Help'),
    log_out: i18n.t('Log out'),
    about_dhis2: i18n.t('About DHIS 2'),
    manage_my_apps: i18n.t('Manage my apps'),
    no_results_found: i18n.t('No results found'),
    interpretations: i18n.t('Interpretations'),
    messages: i18n.t('Messages'),
    display_name: i18n.t('Name'),
    report_table: i18n.t('Report Table'),
    id: i18n.t('ID'),
    createReport: i18n.t('Create'),
    editReport: i18n.t('Edit'),
    actions: i18n.t('Actions'),
    delete: i18n.t('Delete'),
    sharingSettings: i18n.t('Sharing settings'),
    viewResource: i18n.t('View Resource'),
    editResource: i18n.t('Edit Resource'),
    add_users_and_user_groups: i18n.t('Add users and user groups'),
    enter_names: i18n.t('Enter names'),
    share: i18n.t('Sharing settings'),
    metadata: i18n.t('Permissions'),
    created_by: i18n.t('Created By'),
    who_has_access: i18n.t('Who has access'),
    external_access: i18n.t('External access (without login)'),
    can_edit_and_view: i18n.t('Can edit and view'),
    can_view: i18n.t('Can view'),
    can_view_only: i18n.t('Can view only'),
    no_access: i18n.t('No access'),
    public_access: i18n.t('Public access (with login)'),
    public_can_edit: i18n.t('Public can edit'),
    public_can_view: i18n.t('Public can view'),
    anyone_can_find_view_and_edit: i18n.t('Public can find, view and edit'),
    anyone_can_find_and_view: i18n.t('Public can find and view'),
    close: i18n.t('Close'),
    week: i18n.t('week'),
    month: i18n.t('month'),
    year: i18n.t('year'),
    biMonth: i18n.t('bi monthly'),
    day: i18n.t('day'),
    jan: i18n.t('January'),
    feb: i18n.t('February'),
    mar: i18n.t('March'),
    apr: i18n.t('April'),
    may: i18n.t('May'),
    jun: i18n.t('June'),
    jul: i18n.t('July'),
    aug: i18n.t('August'),
    sep: i18n.t('September'),
    oct: i18n.t('October'),
    nov: i18n.t('November'),
    dec: i18n.t('December'),
    'jan-feb': i18n.t('January-February'),
    'mar-apr': i18n.t('March-April'),
    'may-jun': i18n.t('May-June'),
    'jul-aug': i18n.t('July-August'),
    'sep-oct': i18n.t('September-October'),
    'nov-dec': i18n.t('November-December'),
    'nov-apr': i18n.t('November-April'),
    'may-oct': i18n.t('May-October'),
    quarter: i18n.t('quarter'),
    Q1: i18n.t('January-March'),
    Q2: i18n.t('April-June'),
    Q3: i18n.t('July-September'),
    Q4: i18n.t('October-December'),
    sixMonth: i18n.t('six monthly'),
    'jan-jun': i18n.t('January-June'),
    'jul-dec': i18n.t('July-December'),
    'apr-sep': i18n.t('April-September'),
    'oct-mar': i18n.t('October-March'),
    biWeek: i18n.t('Bi-Week'),
    bi_week: i18n.t('Bi-Week'),
}

const injectTranslationsToD2 = d2 => {
    if (d2) {
        Object.assign(d2.i18n.translations, d2UiTranslations)
    }
}

export default injectTranslationsToD2
