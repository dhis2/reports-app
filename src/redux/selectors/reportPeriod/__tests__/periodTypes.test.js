import { getFilteredPeriodTypes } from '../periodTypes.js'

describe('getFilteredPeriodTypes', () => {
    const periodTypes = [{ name: 'Daily' }, { name: 'WeeklyWednesday' }]
    const state = {
        reportPeriod: {
            collection: periodTypes,
        },
        standardReport: {
            showReportParams: false,
        },
    }

    const expectedOutput = [
        { id: 'Daily', displayName: 'Daily' },
        { id: 'WeeklyWednesday', displayName: 'Weekly Wednesday' },
    ]

    it('transforms the input array correctly', () => {
        expect(getFilteredPeriodTypes(state)).toEqual(expectedOutput)
    })
})
