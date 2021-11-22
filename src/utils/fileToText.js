export const fileToText = (blob) =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsText(blob)
        fileReader.onload = (event) => {
            if (event.target.readyState !== 2) {
                return
            }
            if (event.target.error) {
                reject('File could not be read')
            }
            resolve(event.target.result)
        }
    })
