export const reportResponseData = {
    headers: [
        {
            name: 'ou',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'chp',
            column: 'CHP',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'chc',
            column: 'CHC',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'mchp',
            column: 'MCHP',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'clinic',
            column: 'Clinic',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'hospital',
            column: 'Hospital',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
    ],
    height: 16,
    rows: [
        ['Gbo', '', '1', '', '', ''],
        ['Bo', '18', '26', '58', '7', '4'],
        ['Tikonko', '1', '2', '3', '', ''],
        ['Niawa Lenga', '', '2', '1', '', ''],
        ['Bargbe', '', '1', '4', '', ''],
        ['Komboya', '', '1', '2', '', ''],
        ['Valunia', '2', '2', '3', '', ''],
        ['Lugbu', '2', '1', '6', '', ''],
        ['Selenga', '', '1', '1', '', ''],
        ['Wonde', '', '1', '2', '', ''],
        ['Bargbo', '1', '1', '5', '', ''],
        ['Kakua', '3', '7', '17', '7', '3'],
        ['Jaiama Bongor', '3', '1', '2', '', ''],
        ['Baoma', '3', '3', '7', '', ''],
        ['Bumpe Ngao', '3', '1', '4', '', '1'],
        ['Badjia', '', '1', '1', '', ''],
    ],
    width: 6,
    fileUrls: [
        {
            extension: 'xls',
            url:
                'http://localhost:8080/dhis/api/32/orgUnitAnalytics.xls?ou=O6uvpzGd5pu;YmmeuGbqOwR;JdhagCUEMbj;ARZ4y5i4reU;sxRd2XOzFbz;vWbkYPRmKyS;YuQRtpLP10I;I4jWcnFmgEC;daJPPxtIrQn;npWGUj37qDe;kU8vhUkAGaT;BGGmAwx33dj;dGheVylzol6;U6Kr7Gtpidn;KctpIIucige;zFDYIgyGmXG&ougs=J5jldMd8OHv&columns=J5jldMd8OHv',
        },
        {
            extension: 'pdf',
            url:
                'http://localhost:8080/dhis/api/32/orgUnitAnalytics.pdf?ou=O6uvpzGd5pu;YmmeuGbqOwR;JdhagCUEMbj;ARZ4y5i4reU;sxRd2XOzFbz;vWbkYPRmKyS;YuQRtpLP10I;I4jWcnFmgEC;daJPPxtIrQn;npWGUj37qDe;kU8vhUkAGaT;BGGmAwx33dj;dGheVylzol6;U6Kr7Gtpidn;KctpIIucige;zFDYIgyGmXG&ougs=J5jldMd8OHv&columns=J5jldMd8OHv',
        },
    ],
}
export const transformedTableData = {
    title: 'CHP - Bo',
    headers: [
        'Organisation Unit',
        'CHP',
        'CHC',
        'MCHP',
        'Clinic',
        'Hospital',
        'Total',
    ],
    rows: [
        ['Badjia', 0, 1, 1, 0, 0, 2],
        ['Baoma', 3, 3, 7, 0, 0, 13],
        ['Bargbe', 0, 1, 4, 0, 0, 5],
        ['Bargbo', 1, 1, 5, 0, 0, 7],
        ['Bumpe Ngao', 3, 1, 4, 0, 1, 9],
        ['Gbo', 0, 1, 0, 0, 0, 1],
        ['Jaiama Bongor', 3, 1, 2, 0, 0, 6],
        ['Kakua', 3, 7, 17, 7, 3, 37],
        ['Komboya', 0, 1, 2, 0, 0, 3],
        ['Lugbu', 2, 1, 6, 0, 0, 9],
        ['Niawa Lenga', 0, 2, 1, 0, 0, 3],
        ['Selenga', 0, 1, 1, 0, 0, 2],
        ['Tikonko', 1, 2, 3, 0, 0, 6],
        ['Valunia', 2, 2, 3, 0, 0, 7],
        ['Wonde', 0, 1, 2, 0, 0, 3],
        ['Bo', 18, 26, 58, 7, 4, 113],
    ],
}

export const chartResponseData = {
    headers: [
        {
            name: 'ou',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'chp',
            column: 'CHP',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'chc',
            column: 'CHC',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'mchp',
            column: 'MCHP',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'clinic',
            column: 'Clinic',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
        {
            name: 'hospital',
            column: 'Hospital',
            type: 'java.lang.String',
            hidden: false,
            meta: false,
        },
    ],
    height: 1,
    rows: [['Bo', '18', '26', '58', '7', '4']],
    width: 6,
    fileUrls: [
        {
            extension: 'xls',
            url:
                'http://localhost:8080/dhis/api/32/orgUnitAnalytics.xls?ou=O6uvpzGd5pu&ougs=J5jldMd8OHv&columns=J5jldMd8OHv',
        },
        {
            extension: 'pdf',
            url:
                'http://localhost:8080/dhis/api/32/orgUnitAnalytics.pdf?ou=O6uvpzGd5pu&ougs=J5jldMd8OHv&columns=J5jldMd8OHv',
        },
    ],
}

export const transformedChartData = {
    data: {
        labels: ['CHP', 'CHC', 'MCHP', 'Clinic', 'Hospital'],
        datasets: [
            {
                label: 'Count',
                backgroundColor: 'rgba(39, 102, 150, 0.6)',
                borderColor: 'rgb(39, 102, 150)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(39, 102, 150, 0.8)',
                data: [18, 26, 58, 7, 4],
            },
        ],
    },
    options: {
        title: {
            display: true,
            text: 'CHP - Bo',
            fontSize: '16',
            fontFamily: "'Roboto', sans-serif",
        },
        legend: {
            position: 'bottom',
            fontFamily: "'Roboto', sans-serif",
        },
        animation: {
            duration: 180,
        },
    },
}
