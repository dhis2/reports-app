import humanReadableErrorMessage, {
    fallBackDefault,
} from '../humanReadableErrorMessage.js'

describe('humanReadableErrorMessage', () => {
    const fallBackErrorMessage = 'I am a fallback message'
    const regularErrorObject401 = {
        httpStatusCode: 401,
        message: 'Oops a 401',
    }
    const regularErrorObject500 = {
        httpStatusCode: 500,
        message: 'Internal server error',
    }
    const dhis2ErrorObject = {
        messages: [
            { message: 'Oh noooo' },
            { message: 'something' },
            { message: 'went wrong!!!' },
        ],
    }

    it('returns the error message of a 401 error', () => {
        const result = humanReadableErrorMessage(
            regularErrorObject401,
            fallBackErrorMessage
        )
        expect(result).toEqual(regularErrorObject401.message)
    })
    it('returns the provided fallback message of a 500 error', () => {
        const result = humanReadableErrorMessage(
            regularErrorObject500,
            fallBackErrorMessage
        )
        expect(result).toEqual(fallBackErrorMessage)
    })
    it('returns the default fallback message for a 500 error with no fallbackMessage argument', () => {
        const result = humanReadableErrorMessage(regularErrorObject500)
        expect(result).toEqual(fallBackDefault)
    })
    it('handles an error with a messages array correctly', () => {
        const actualResult = humanReadableErrorMessage(
            dhis2ErrorObject,
            fallBackErrorMessage
        )
        const expectedResult = 'Oh noooo, something, went wrong!!!'
        expect(actualResult).toEqual(expectedResult)
    })
})
