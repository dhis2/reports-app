export default function createDataTransformCache() {
    let inputData = null
    let transformedData = null
    return {
        hasValidCacheFor: data => !!inputData && data === inputData,
        getCachedResult: () => transformedData,
        setCachedResult: (input, transformed) => {
            inputData = input
            transformedData = transformed
        },
    }
}
