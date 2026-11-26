import i18n from '@dhis2/d2-i18n'

/*
 * Three finished-looking standard reports for demonstrations.
 *
 * A real instance's HTML reports are whatever a local team happened to write,
 * and on a training database they are usually stubs — which makes the page
 * look unfinished when the point of the demo is the page. These three are
 * report designs of the kind a ministry actually ships: a coverage summary, a
 * reporting-rate review and a quarterly maternal health review.
 *
 * They are inert in exactly one way: the numbers are fixed rather than read
 * from the server. Everything else — how they are listed, what they ask for
 * before running, how they are generated and framed — goes through the same
 * code as any other report, which is what the demo is about.
 *
 * Remove this file, its two imports in ReportBrowse and StandardReportNext,
 * and the demo reports are gone.
 */

const DEMO_PREFIX = 'Demo: '

const person = { displayName: i18n.t('Ministry of Health, HMIS unit') }

const shared = {
    access: { read: true, write: false, update: false, delete: false },
    sharing: { public: 'r-------', users: {}, userGroups: {} },
    created: '2026-02-11T09:14:00.000',
    lastUpdated: '2026-08-19T11:42:00.000',
    createdBy: person,
    lastUpdatedBy: person,
}

export const DEMO_REPORTS = [
    {
        ...shared,
        id: 'demoImmuni1',
        displayName: `${DEMO_PREFIX}${i18n.t('Immunisation coverage summary')}`,
        reportParams: { reportingPeriod: true, organisationUnit: true },
        relativePeriods: { thisMonth: true, lastMonth: true },
    },
    {
        ...shared,
        id: 'demoReport2',
        displayName: `${DEMO_PREFIX}${i18n.t('Facility reporting rates')}`,
        reportParams: { reportingPeriod: true, organisationUnit: true },
        relativePeriods: { thisMonth: true, lastMonth: true },
    },
    {
        ...shared,
        id: 'demoMatern3',
        displayName: `${DEMO_PREFIX}${i18n.t(
            'Maternal health quarterly review'
        )}`,
        reportParams: { reportingPeriod: true, organisationUnit: true },
        relativePeriods: {
            thisQuarter: true,
            lastQuarter: true,
            last4Quarters: true,
        },
    },
]

const DEMO_IDS = DEMO_REPORTS.map((report) => report.id)

export const isDemoReport = (id) => DEMO_IDS.includes(id)

/* ---------------- the designs ---------------- */

/*
 * The report designs are written as if by a local team: a fragment with its
 * own stylesheet, which is what an HTML report is. They are given the legacy
 * DHIS2 stylesheets in the frame around them, so every rule here is scoped
 * under #demo-report and states its own values rather than inheriting.
 */
const STYLES = `
#demo-report {
    box-sizing: border-box;
    max-width: 980px;
    margin: 0 auto;
    padding: 28px 32px 40px;
    font-family: Roboto, -apple-system, "Segoe UI", sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #212934;
    background: #ffffff;
    text-align: left;
}
#demo-report * { box-sizing: border-box; }
/* The legacy stylesheets in the frame border and pad every cell. */
#demo-report table td,
#demo-report table th {
    border: none;
    padding: 0;
    font-weight: 400;
}
#demo-report .masthead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 14px;
    border-bottom: 2px solid #1d5b8f;
}
#demo-report .identity {
    display: flex;
    align-items: flex-start;
    gap: 14px;
}
#demo-report .logo { flex: none; }
#demo-report .crest {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #1d5b8f;
}
#demo-report h1 {
    margin: 5px 0 4px;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.25;
    color: #10263e;
}
#demo-report .subtitle { margin: 0; font-size: 13px; color: #4a5768; }
#demo-report .stamp {
    flex: none;
    text-align: right;
    font-size: 11px;
    color: #6c7787;
}
#demo-report .stamp dt { margin: 0; font-weight: 500; color: #4a5768; }
#demo-report .stamp dd { margin: 0 0 6px; }
#demo-report h2 {
    margin: 26px 0 10px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #1d5b8f;
}
#demo-report p.note {
    margin: 8px 0 0;
    font-size: 12px;
    color: #6c7787;
}
#demo-report .summary {
    margin-top: 18px;
    font-size: 13px;
    color: #212934;
}
#demo-report .summary strong { font-weight: 500; color: #10263e; }
#demo-report table.data {
    width: 100%;
    margin-top: 4px;
    border-collapse: collapse;
    font-size: 13px;
    background: #ffffff;
}
#demo-report table.data thead th {
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
    color: #4a5768;
    background: #f4f6f8;
    border-bottom: 1px solid #c5cdd6;
}
#demo-report table.data tbody td {
    padding: 7px 10px;
    color: #212934;
    border-bottom: 1px solid #e8edf2;
}
#demo-report table.data tbody tr:nth-child(even) td { background: #fbfcfd; }
#demo-report table.data tfoot td {
    padding: 8px 10px;
    font-weight: 500;
    color: #10263e;
    background: #f4f6f8;
    border-top: 2px solid #c5cdd6;
}
#demo-report table.data thead th.num,
#demo-report table.data tbody td.num,
#demo-report table.data tfoot td.num {
    text-align: right;
}
/* The chart frame, as the analytics charts render it: white, unboxed. */
#demo-report .chart { margin: 6px 0 4px; }
#demo-report footer {
    margin-top: 30px;
    padding-top: 10px;
    font-size: 11px;
    color: #6c7787;
    border-top: 1px solid #e8edf2;
}
@media print {
    #demo-report { padding: 0; max-width: none; }
}
`

/* ---------------- charts ---------------- */

/*
 * Standard reports draw their charts the way the rest of DHIS2 does — the
 * Highcharts defaults the analytics apps use — so these are those defaults
 * written out as SVG: the default series colours, #e6e6e6 gridlines, a
 * #ccd6eb category axis, a centred title and a legend underneath.
 */
const SERIES_COLORS = [
    '#7cb5ec',
    '#434348',
    '#90ed7d',
    '#f7a35c',
    '#8085e9',
    '#f15c80',
]

const AXIS_LABEL =
    'font-family="Roboto, sans-serif" font-size="11" fill="#666666"'
const TITLE_LABEL =
    'font-family="Roboto, sans-serif" font-size="15" fill="#333333"'
const LEGEND_LABEL =
    'font-family="Roboto, sans-serif" font-size="12" fill="#333333"'

const WIDTH = 900
const PAD = { top: 40, right: 20, bottom: 64, left: 54 }

const ticks = (max, count = 5) =>
    Array.from({ length: count + 1 }, (_, index) => (max / count) * index)

const chartFrame = ({ title, height, max, categories, valueSuffix }) => {
    const plotWidth = WIDTH - PAD.left - PAD.right
    const plotHeight = height - PAD.top - PAD.bottom
    const y = (value) => PAD.top + plotHeight - (value / max) * plotHeight
    const bandWidth = plotWidth / categories.length

    return {
        y,
        bandWidth,
        plotWidth,
        plotHeight,
        svg: (body, legend) => `
<div class="chart">
    <svg viewBox="0 0 ${WIDTH} ${height}" width="100%" role="img" aria-label="${title}">
        <rect x="0" y="0" width="${WIDTH}" height="${height}" fill="#ffffff" />
        <text x="${
            WIDTH / 2
        }" y="24" text-anchor="middle" ${TITLE_LABEL}>${title}</text>

        ${ticks(max)
            .map(
                (value) => `
        <line x1="${PAD.left}" x2="${WIDTH - PAD.right}" y1="${y(
                    value
                )}" y2="${y(value)}" stroke="#e6e6e6" stroke-width="1" />
        <text x="${PAD.left - 8}" y="${
                    y(value) + 4
                }" text-anchor="end" ${AXIS_LABEL}>${Math.round(
                    value
                )}${valueSuffix}</text>`
            )
            .join('')}

        ${body}

        <line x1="${PAD.left}" x2="${WIDTH - PAD.right}" y1="${y(0)}" y2="${y(
            0
        )}" stroke="#ccd6eb" stroke-width="1" />

        ${categories
            .map(
                (category, index) => `
        <text x="${PAD.left + bandWidth * (index + 0.5)}" y="${
                    y(0) + 18
                }" text-anchor="middle" ${AXIS_LABEL}>${category}</text>`
            )
            .join('')}

        ${legend}
    </svg>
</div>
`,
    }
}

/* The legend Highcharts draws by default: centred under the plot, one square
 * and one label per series. */
const legendRow = ({ series, height }) => {
    const items = series.map((entry, index) => ({
        label: entry.name,
        color: SERIES_COLORS[index % SERIES_COLORS.length],
        width: entry.name.length * 6.4 + 26,
    }))
    const total = items.reduce((sum, item) => sum + item.width, 0)
    let cursor = (WIDTH - total) / 2

    return items
        .map((item) => {
            const x = cursor
            cursor += item.width
            return `
        <rect x="${x}" y="${height - 22}" width="10" height="10" rx="2" fill="${
                item.color
            }" />
        <text x="${x + 16}" y="${height - 13}" ${LEGEND_LABEL}>${
                item.label
            }</text>`
        })
        .join('')
}

const columnChart = ({
    title,
    categories,
    series,
    max = 100,
    valueSuffix = '%',
    height = 300,
}) => {
    const frame = chartFrame({
        title,
        height,
        max,
        categories,
        valueSuffix,
    })

    /* Highcharts leaves a fifth of the band empty either side of a group. */
    const groupWidth = frame.bandWidth * 0.8
    const barWidth = groupWidth / series.length

    const body = series
        .map((entry, seriesIndex) =>
            entry.data
                .map((value, index) => {
                    const x =
                        PAD.left +
                        frame.bandWidth * index +
                        frame.bandWidth * 0.1 +
                        barWidth * seriesIndex
                    const top = frame.y(value)

                    return `<rect x="${x.toFixed(1)}" y="${top.toFixed(
                        1
                    )}" width="${(barWidth - 2).toFixed(1)}" height="${(
                        frame.y(0) - top
                    ).toFixed(1)}" fill="${
                        SERIES_COLORS[seriesIndex % SERIES_COLORS.length]
                    }" />`
                })
                .join('')
        )
        .join('')

    return frame.svg(body, legendRow({ series, height }))
}

const lineChart = ({
    title,
    categories,
    series,
    max = 100,
    valueSuffix = '%',
    height = 300,
}) => {
    const frame = chartFrame({
        title,
        height,
        max,
        categories,
        valueSuffix,
    })

    const body = series
        .map((entry, seriesIndex) => {
            const color = SERIES_COLORS[seriesIndex % SERIES_COLORS.length]
            const points = entry.data.map(
                (value, index) =>
                    `${(PAD.left + frame.bandWidth * (index + 0.5)).toFixed(
                        1
                    )},${frame.y(value).toFixed(1)}`
            )

            return `
        <polyline fill="none" stroke="${color}" stroke-width="2" points="${points.join(
                ' '
            )}" />
        ${points
            .map((point) => {
                const [x, cy] = point.split(',')
                return `<circle cx="${x}" cy="${cy}" r="4" fill="${color}" stroke="#ffffff" stroke-width="2" />`
            })
            .join('')}`
        })
        .join('')

    return frame.svg(body, legendRow({ series, height }))
}

/* ---------------- facility logos ---------------- */

/*
 * Each design carries the mark of the facility that publishes it, drawn
 * inline: a report is one HTML file, and a logo that depends on an uploaded
 * image is a logo that goes missing.
 */
const LOGOS = {
    hospital: `
<svg class="logo" width="46" height="46" viewBox="0 0 46 46" role="img" aria-hidden="true">
    <circle cx="23" cy="23" r="22" fill="#1d5b8f" />
    <circle cx="23" cy="23" r="17" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6" />
    <path d="M20 11h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill="#ffffff" />
    <path d="M13 33h20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
</svg>`,
    district: `
<svg class="logo" width="46" height="46" viewBox="0 0 46 46" role="img" aria-hidden="true">
    <path d="M23 2l18 7v14c0 10-7.6 18.5-18 21C12.6 41.5 5 33 5 23V9z" fill="#147460" />
    <path d="M23 6.5l14 5.4V23c0 8-6 15-14 17.3C15 38 9 31 9 23V11.9z" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.55" />
    <path d="M23 32c-5-3.4-8-6.6-8-10a4.4 4.4 0 018-2.6A4.4 4.4 0 0131 22c0 3.4-3 6.6-8 10z" fill="#ffffff" />
</svg>`,
    maternal: `
<svg class="logo" width="46" height="46" viewBox="0 0 46 46" role="img" aria-hidden="true">
    <circle cx="23" cy="23" r="22" fill="#8a3f7a" />
    <circle cx="19" cy="16" r="5" fill="#ffffff" />
    <path d="M10 38c0-6.6 4-11.5 9-11.5S28 31.4 28 38z" fill="#ffffff" />
    <circle cx="31" cy="24" r="3.6" fill="#ffffff" stroke="#8a3f7a" stroke-width="1.6" />
    <path d="M25.5 38c0-3.8 2.5-6.6 5.5-6.6s5.5 2.8 5.5 6.6z" fill="#ffffff" stroke="#8a3f7a" stroke-width="1.6" />
</svg>`,
}

const shell = ({ logo, facility, title, subtitle, orgUnit, period, body }) => `
<div id="demo-report">
    <style type="text/css">${STYLES}</style>

    <div class="masthead">
        <div class="identity">
            ${logo}
            <div>
                <div class="crest">${facility}</div>
                <h1>${title}</h1>
                <p class="subtitle">${subtitle}</p>
            </div>
        </div>
        <dl class="stamp">
            <dt>${i18n.t('Organisation unit')}</dt>
            <dd>${orgUnit}</dd>
            <dt>${i18n.t('Reporting period')}</dt>
            <dd>${period}</dd>
        </dl>
    </div>

    ${body}

    <footer>
        ${i18n.t(
            'Figures are illustrative and provided for demonstration purposes. Aggregated from routine facility reporting.'
        )}
    </footer>
</div>
`

/* ---------------- 1. immunisation coverage ---------------- */

const ANTIGENS = [
    { name: 'BCG', doses: 12480, target: 13100, coverage: 95 },
    { name: 'OPV 3', doses: 11320, target: 13100, coverage: 86 },
    { name: 'Penta 3', doses: 11540, target: 13100, coverage: 88 },
    { name: 'PCV 3', doses: 11210, target: 13100, coverage: 86 },
    { name: 'Rotavirus 2', doses: 10870, target: 13100, coverage: 83 },
    { name: 'Measles 1', doses: 9940, target: 13100, coverage: 76 },
    { name: 'Measles 2', doses: 7620, target: 13100, coverage: 58 },
]

const immunisationBody = () => {
    const totalDoses = ANTIGENS.reduce((sum, row) => sum + row.doses, 0)

    return `
    <p class="summary">
        ${i18n.t(
            'Penta 3 coverage stands at <strong>88%</strong> and 142 of 148 facilities reported for the period. Measles 2 remains the lowest coverage of the schedule at 58%.'
        )}
    </p>

    <h2>${i18n.t('Coverage by antigen')}</h2>
    ${columnChart({
        title: i18n.t('Immunisation coverage by antigen (%)'),
        categories: ANTIGENS.map((row) => row.name),
        series: [
            {
                name: i18n.t('Coverage'),
                data: ANTIGENS.map((row) => row.coverage),
            },
        ],
    })}

    <h2>${i18n.t('Doses administered')}</h2>
    <table class="data">
        <thead>
            <tr>
                <th>${i18n.t('Antigen')}</th>
                <th class="num">${i18n.t('Doses')}</th>
                <th class="num">${i18n.t('Target population')}</th>
                <th class="num">${i18n.t('Coverage')}</th>
            </tr>
        </thead>
        <tbody>
            ${ANTIGENS.map(
                (row) => `
            <tr>
                <td>${row.name}</td>
                <td class="num">${row.doses.toLocaleString()}</td>
                <td class="num">${row.target.toLocaleString()}</td>
                <td class="num">${row.coverage}%</td>
            </tr>`
            ).join('')}
        </tbody>
        <tfoot>
            <tr>
                <td>${i18n.t('All antigens')}</td>
                <td class="num">${totalDoses.toLocaleString()}</td>
                <td class="num">${(13100 * 7).toLocaleString()}</td>
                <td class="num">82%</td>
            </tr>
        </tfoot>
    </table>
    <p class="note">${i18n.t(
        'Coverage is doses administered against the projected surviving infant population for the period.'
    )}</p>
`
}

/* ---------------- 2. reporting rates ---------------- */

const DISTRICTS = [
    { name: 'Bombali', facilities: 34, expected: 34, actual: 33, ontime: 91 },
    { name: 'Kailahun', facilities: 28, expected: 28, actual: 27, ontime: 86 },
    { name: 'Kambia', facilities: 22, expected: 22, actual: 17, ontime: 73 },
    { name: 'Kenema', facilities: 31, expected: 31, actual: 31, ontime: 97 },
    { name: 'Koinadugu', facilities: 19, expected: 19, actual: 14, ontime: 64 },
    { name: 'Port Loko', facilities: 26, expected: 26, actual: 25, ontime: 88 },
    {
        name: 'Western Area',
        facilities: 41,
        expected: 41,
        actual: 40,
        ontime: 94,
    },
]

const districtRate = (row) => Math.round((row.actual / row.expected) * 100)

const reportingRatesBody = () => {
    const expected = DISTRICTS.reduce((sum, row) => sum + row.expected, 0)
    const actual = DISTRICTS.reduce((sum, row) => sum + row.actual, 0)
    const rate = Math.round((actual / expected) * 100)
    const ontime = Math.round(
        DISTRICTS.reduce((sum, row) => sum + row.ontime, 0) / DISTRICTS.length
    )

    return `
    <p class="summary">
        ${i18n.t(
            'The national reporting rate for the monthly summary form is <strong>93%</strong>, with 187 of 201 expected reports received. Koinadugu and Kambia remain below 80%.'
        )}
    </p>

    <h2>${i18n.t('Completeness and timeliness by district')}</h2>
    ${columnChart({
        title: i18n.t('Reporting rate and on-time reporting by district (%)'),
        categories: DISTRICTS.map((row) => row.name),
        series: [
            {
                name: i18n.t('Reporting rate'),
                data: DISTRICTS.map((row) => districtRate(row)),
            },
            {
                name: i18n.t('Reported on time'),
                data: DISTRICTS.map((row) => row.ontime),
            },
        ],
    })}

    <h2>${i18n.t('Reports received')}</h2>
    <table class="data">
        <thead>
            <tr>
                <th>${i18n.t('District')}</th>
                <th class="num">${i18n.t('Facilities')}</th>
                <th class="num">${i18n.t('Expected reports')}</th>
                <th class="num">${i18n.t('Reports received')}</th>
                <th class="num">${i18n.t('Reporting rate')}</th>
                <th class="num">${i18n.t('On time')}</th>
            </tr>
        </thead>
        <tbody>
            ${DISTRICTS.map(
                (row) => `
            <tr>
                <td>${row.name}</td>
                <td class="num">${row.facilities}</td>
                <td class="num">${row.expected}</td>
                <td class="num">${row.actual}</td>
                <td class="num">${districtRate(row)}%</td>
                <td class="num">${row.ontime}%</td>
            </tr>`
            ).join('')}
        </tbody>
        <tfoot>
            <tr>
                <td>${i18n.t('National')}</td>
                <td class="num">${DISTRICTS.reduce(
                    (sum, row) => sum + row.facilities,
                    0
                )}</td>
                <td class="num">${expected}</td>
                <td class="num">${actual}</td>
                <td class="num">${rate}%</td>
                <td class="num">${ontime}%</td>
            </tr>
        </tfoot>
    </table>
    <p class="note">${i18n.t(
        'Expected reports are derived from facilities assigned to the data set for the period.'
    )}</p>
`
}

/* ---------------- 3. maternal health ---------------- */

const QUARTERS = ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026']
const ANC_1 = [82, 85, 88, 91]
const ANC_4 = [61, 64, 69, 74]
const FACILITY_DELIVERIES = [71, 74, 76, 79]

const MATERNAL_INDICATORS = [
    { name: i18n.t('ANC 1st visit'), value: 91, cases: 18420 },
    { name: i18n.t('ANC 4th visit'), value: 74, cases: 14980 },
    {
        name: i18n.t('Deliveries in a health facility'),
        value: 79,
        cases: 15870,
    },
    { name: i18n.t('Skilled birth attendance'), value: 83, cases: 16680 },
    { name: i18n.t('Postnatal care within 48 hours'), value: 68, cases: 13640 },
    { name: i18n.t('IPTp 3 doses'), value: 57, cases: 11510 },
]

const maternalBody = () => `
    <p class="summary">
        ${i18n.t(
            'ANC 4th visit coverage has risen for a fourth consecutive quarter to <strong>74%</strong>. Facility deliveries reached 15,870, and 18 of 21 maternal deaths were reviewed.'
        )}
    </p>

    <h2>${i18n.t('Trend over the last four quarters')}</h2>
    ${lineChart({
        title: i18n.t('Antenatal care and delivery coverage (%)'),
        categories: QUARTERS,
        series: [
            { name: i18n.t('ANC 1st visit'), data: ANC_1 },
            { name: i18n.t('ANC 4th visit'), data: ANC_4 },
            {
                name: i18n.t('Deliveries in a health facility'),
                data: FACILITY_DELIVERIES,
            },
        ],
    })}

    <h2>${i18n.t('Indicators for the period')}</h2>
    ${columnChart({
        title: i18n.t('Maternal health coverage for the quarter (%)'),
        categories: [
            i18n.t('ANC 1'),
            i18n.t('ANC 4'),
            i18n.t('Facility delivery'),
            i18n.t('Skilled birth'),
            i18n.t('PNC 48h'),
            i18n.t('IPTp 3'),
        ],
        series: [
            {
                name: i18n.t('Coverage'),
                data: MATERNAL_INDICATORS.map((row) => row.value),
            },
        ],
    })}

    <table class="data">
        <thead>
            <tr>
                <th>${i18n.t('Indicator')}</th>
                <th class="num">${i18n.t('Cases')}</th>
                <th class="num">${i18n.t('Coverage')}</th>
            </tr>
        </thead>
        <tbody>
            ${MATERNAL_INDICATORS.map(
                (row) => `
            <tr>
                <td>${row.name}</td>
                <td class="num">${row.cases.toLocaleString()}</td>
                <td class="num">${row.value}%</td>
            </tr>`
            ).join('')}
        </tbody>
    </table>
    <p class="note">${i18n.t(
        'Coverage is measured against the expected number of pregnancies for the period.'
    )}</p>
`

const BODIES = {
    demoImmuni1: {
        logo: LOGOS.hospital,
        facility: i18n.t(
            'Bo Government Hospital · Expanded Programme on Immunisation'
        ),
        title: i18n.t('Immunisation coverage summary'),
        subtitle: i18n.t(
            'Routine immunisation performance against the projected infant population'
        ),
        body: immunisationBody,
    },
    demoReport2: {
        logo: LOGOS.district,
        facility: i18n.t('Kenema District Health Management Team'),
        title: i18n.t('Facility reporting rates'),
        subtitle: i18n.t(
            'Completeness and timeliness of the monthly summary form'
        ),
        body: reportingRatesBody,
    },
    demoMatern3: {
        logo: LOGOS.maternal,
        facility: i18n.t('Makeni Maternal and Child Health Centre'),
        title: i18n.t('Maternal health quarterly review'),
        subtitle: i18n.t(
            'Antenatal care, delivery and postnatal indicators for the quarter'
        ),
        body: maternalBody,
    },
}

/**
 * The generated report, in place of the API's response. The org unit and
 * period are the ones the rail asked for, so the design reflects the
 * parameters even though the figures do not.
 */
export const demoReportHtml = (id, { ouName, peLabel }) => {
    const design = BODIES[id]

    if (!design) {
        return ''
    }

    return shell({
        logo: design.logo,
        facility: design.facility,
        title: design.title,
        subtitle: design.subtitle,
        orgUnit: ouName || i18n.t('All organisation units'),
        period: peLabel || i18n.t('Current period'),
        body: design.body(),
    })
}
