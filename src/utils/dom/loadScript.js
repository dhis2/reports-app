export const loadScript = src => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src

    const scriptPromise = new Promise(resolve => {
        script.onload = resolve
    })
    document.head.appendChild(script)
    return scriptPromise
}
