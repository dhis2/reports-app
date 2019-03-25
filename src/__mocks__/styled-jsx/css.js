const returnEmpyString = () => ''
function css() {
    return returnEmpyString()
}

css.resolve = returnEmpyString
css.global = returnEmpyString

module.exports = css
module.exports.global = css.global
module.exports.resolve = css.resolve
