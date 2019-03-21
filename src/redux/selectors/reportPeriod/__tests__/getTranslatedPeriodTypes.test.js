import { getTranslatedPeriodTypes } from '../getTranslatedPeriodTypes'

describe('getTranslatedPeriodTypes', () => {
    const periodTypes = [{ name: 'Daily' }, { name: 'WeeklyWednesday' }]
    const state = {
        reportPeriod: {
            collection: periodTypes,
        },
    }

    const expectedOutput = [
        { id: 'Daily', displayName: 'Daily' },
        { id: 'WeeklyWednesday', displayName: 'Weekly Wednesday' },
    ]

    it('transforms the input array correctly', () => {
        expect(getTranslatedPeriodTypes(state)).toEqual(expectedOutput)
    })
})
