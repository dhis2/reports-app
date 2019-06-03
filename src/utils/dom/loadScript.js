import { getContextPath } from '../api'

export const loadScript = src => {
    const serverUrl = getContextPath()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = serverUrl + src
    const scriptPromise = new Promise(resolve => {
        script.onload = resolve
    })
    document.head.appendChild(script)
    return scriptPromise
}
