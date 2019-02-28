import i18n from './locales'

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
    editReport: i18n.t('Edit Report'),
    actions: i18n.t('Actions'),
    delete: i18n.t('Delete'),
    sharingSettings: i18n.t('Sharing Settings'),
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
    jan: i18n.t('jan'),
    feb: i18n.t('feb'),
    mar: i18n.t('mar'),
    apr: i18n.t('apr'),
    may: i18n.t('may'),
    jun: i18n.t('jun'),
    jul: i18n.t('jul'),
    aug: i18n.t('aug'),
    sep: i18n.t('sep'),
    oct: i18n.t('oct'),
    nov: i18n.t('nov'),
    dec: i18n.t('dec'),
    'jan-feb': i18n.t('jan-feb'),
    'mar-apr': i18n.t('mar-apr'),
    'may-jun': i18n.t('may-jun'),
    'jul-aug': i18n.t('jul-aug'),
    'sep-oct': i18n.t('sep-oct'),
    'nov-dec': i18n.t('nov-dec'),
    quarter: i18n.t('quarter'),
    Q1: i18n.t('Q1'),
    Q2: i18n.t('Q2'),
    Q3: i18n.t('Q3'),
    Q4: i18n.t('Q4'),
    sixMonth: i18n.t('six monthly'),
    'jan-jun': i18n.t('jan-jun'),
    'jul-dec': i18n.t('jul-dec'),
    'apr-sep': i18n.t('apr-sep'),
    'oct-mar': i18n.t('oct-mar'),
    biWeek: i18n.t('Bi-Week'),
    bi_week: i18n.t('Bi-Week'),
}

const injectTranslationsToD2 = d2 => {
    if (d2) {
        Object.assign(d2.i18n.translations, d2UiTranslations)
    }
}

export default injectTranslationsToD2
