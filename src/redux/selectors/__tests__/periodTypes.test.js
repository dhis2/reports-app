import pluckPeriodTypes from '../periodTypes'

describe('pluckPeriodTypes', () => {
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
        expect(pluckPeriodTypes(state)).toEqual(expectedOutput)
    })
})
