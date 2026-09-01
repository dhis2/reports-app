import i18n from '@dhis2/d2-i18n'
import {
    IconCheckmarkCircle24,
    IconFileDocument24,
    IconFolder24,
    IconStarFilled24,
    IconTable24,
    IconVisualizationColumn24,
} from '@dhis2/ui'
import {
    DATA_SET_REPORT_NEXT_SECTION_KEY,
    DATA_SET_REPORT_SECTION_KEY,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
    REPORTING_RATE_SUMMARY_SECTION_KEY,
    RESOURCE_SECTION_KEY,
    STANDARD_REPORT_NEXT_SECTION_KEY,
    STANDARD_REPORT_SECTION_KEY,
    sections,
} from '../../config/sections.config.js'

/*
 * The five features are not five equal things, and a flat list of five says
 * they are. The grouping below is the one from the decision brief in
 * docs/: it splits them by who decides the question being answered.
 *
 * Section labels and paths still come from sections.config.js, so nothing is
 * duplicated here — only the grouping and the icons.
 */
const GROUPS = [
    {
        label: i18n.t('Reports built for you'),
        hint: i18n.t('You choose the scope, the app knows the question'),
        keys: [
            DATA_SET_REPORT_SECTION_KEY,
            DATA_SET_REPORT_NEXT_SECTION_KEY,
            REPORTING_RATE_SUMMARY_SECTION_KEY,
            ORG_UNIT_DIST_REPORT_SECTION_KEY,
        ],
    },
    {
        label: i18n.t('Designed by your team'),
        hint: i18n.t('Reports built outside the app'),
        keys: [STANDARD_REPORT_SECTION_KEY, STANDARD_REPORT_NEXT_SECTION_KEY],
    },
    {
        label: i18n.t('Files and links'),
        hint: i18n.t('Not a report'),
        keys: [RESOURCE_SECTION_KEY],
    },
]

const ICONS = {
    [DATA_SET_REPORT_SECTION_KEY]: IconTable24,
    [DATA_SET_REPORT_NEXT_SECTION_KEY]: IconStarFilled24,
    [REPORTING_RATE_SUMMARY_SECTION_KEY]: IconCheckmarkCircle24,
    [ORG_UNIT_DIST_REPORT_SECTION_KEY]: IconVisualizationColumn24,
    [STANDARD_REPORT_SECTION_KEY]: IconFileDocument24,
    [STANDARD_REPORT_NEXT_SECTION_KEY]: IconStarFilled24,
    [RESOURCE_SECTION_KEY]: IconFolder24,
}

/**
 * One short sentence per feature, in the words a user would use. The formal
 * label stays as the item's name; this is what goes underneath it.
 */
const QUESTIONS = {
    [DATA_SET_REPORT_SECTION_KEY]: i18n.t('A form, filled in, ready to print'),
    [DATA_SET_REPORT_NEXT_SECTION_KEY]: i18n.t('Redesign in progress'),
    [REPORTING_RATE_SUMMARY_SECTION_KEY]: i18n.t(
        'Which offices sent their forms'
    ),
    [ORG_UNIT_DIST_REPORT_SECTION_KEY]: i18n.t(
        'How your facilities break down'
    ),
    [STANDARD_REPORT_SECTION_KEY]: i18n.t('Run a report your team designed'),
    [STANDARD_REPORT_NEXT_SECTION_KEY]: i18n.t('Redesign in progress'),
    [RESOURCE_SECTION_KEY]: i18n.t('Documents and web links'),
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

export const sectionIcon = (key) => ICONS[key]
export const sectionQuestion = (key) => QUESTIONS[key]
