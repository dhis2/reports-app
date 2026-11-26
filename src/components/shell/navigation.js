import i18n from '@dhis2/d2-i18n'
import {
    IconCalendar24,
    IconFileDocument24,
    IconTable24,
    IconVisualizationColumn24,
    IconVisualizationLine24,
} from '@dhis2/ui'
import {
    COLD_CHAIN_FRIDGE_LOG_SECTION_KEY,
    MALARIA_WEEKLY_BULLETIN_SECTION_KEY,
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
    sections,
} from '../../config/sections.config.js'

/*
 * The features are not equal things, and a flat list says they are. The
 * grouping below is the one from the decision brief in docs/: it splits them
 * by who decides the question being answered.
 *
 * Section labels and paths still come from sections.config.js, so nothing is
 * duplicated here — only the grouping and the icons.
 */
const GROUPS = [
    {
        label: i18n.t('Reports built for you'),
        hint: i18n.t('You choose the scope, the app knows the question'),
        keys: [
            DATA_SET_REPORT_NEXT_SECTION_KEY,
            ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY,
            COLD_CHAIN_FRIDGE_LOG_SECTION_KEY,
            MALARIA_WEEKLY_BULLETIN_SECTION_KEY,
        ],
    },
    {
        label: i18n.t('Designed by your team'),
        hint: i18n.t('Reports built outside the app'),
        keys: [STANDARD_REPORT_NEXT_SECTION_KEY],
    },
]

const ICONS = {
    [DATA_SET_REPORT_NEXT_SECTION_KEY]: IconTable24,
    [ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY]: IconVisualizationColumn24,
    [STANDARD_REPORT_NEXT_SECTION_KEY]: IconFileDocument24,
    [COLD_CHAIN_FRIDGE_LOG_SECTION_KEY]: IconCalendar24,
    [MALARIA_WEEKLY_BULLETIN_SECTION_KEY]: IconVisualizationLine24,
}

/**
 * One short sentence per feature, in the words a user would use. The formal
 * label stays as the item's name; this is what goes underneath it.
 */
const QUESTIONS = {
    [DATA_SET_REPORT_NEXT_SECTION_KEY]: i18n.t(
        'View or print data entered for a data set.'
    ),
    [ORG_UNIT_DIST_REPORT_NEXT_SECTION_KEY]: i18n.t(
        'View organisation units by group.'
    ),
    [STANDARD_REPORT_NEXT_SECTION_KEY]: i18n.t('Run a predefined report.'),
    [COLD_CHAIN_FRIDGE_LOG_SECTION_KEY]: i18n.t(
        'Check vaccine fridge daily temperatures for the month.'
    ),
    [MALARIA_WEEKLY_BULLETIN_SECTION_KEY]: i18n.t(
        'MAL-NGO-2027 reporting summary.'
    ),
}

/** The grouping, resolved against the section config. */
export const navGroups = GROUPS.map((group) => ({
    ...group,
    items: group.keys
        .filter((key) => Boolean(sections[key]))
        .map((key) => ({
            key,
            path: sections[key].path,
            label: sections[key].info.label,
            question: QUESTIONS[key],
            Icon: ICONS[key],
        })),
})).filter((group) => group.items.length > 0)
