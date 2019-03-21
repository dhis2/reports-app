const { exec: execCmd, spawn: spawnCmd } = require('child_process')

// stash unstaged changes
exec('git stash -q --keep-index')
    // get staged files
    .then(() => exec('git diff --name-only --cached'))
    .then(files => {
        return exec('git status').then(status => {
            console.log(status)
            return files
        })
    })

    // transform to list
    .then(files => files.split(`\n`).filter(isTruthy))

    // run importjs on those files
    .then(files =>
        files.map(file => {
            console.log('Sorting imports of', file)
            return spawn(`./node_modules/.bin/importjs`, [
                'rewrite',
                '--overwrite',
                file,
            ]).then(() => console.log('done sorting', file))
        })
    )

    .then(sortingPromises => Promise.all(sortingPromises))
    .then(console.log.bind(null, 'All files done.. moving on'))
    .then(() => exec('git status'))

    // add changes
    .then(() => exec('git add -u'))
    .then(() => exec('git status'))

    // reset unstaged changes
    .then(() => exec('git stash pop -q'))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

function exec(cmd) {
    console.info(cmd)
    return new Promise((resolve, reject) => {
        execCmd(cmd, (error, stdout, stderr) => {
            if (error !== null) {
                reject(new Error(error))
            }

            if (typeof stderr !== 'string') {
                reject(new Error(stderr))
            }

            resolve(stdout)
        })
    })
}

function spawn(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = spawnCmd(cmd, args)
        child.stdout.on('data', data => console.log(data))
        child.stderr.on('data', error => reject(error))
        child.on('close', () => resolve())
        child.stdin.end()
    })
}

function isTruthy(v) {
    return !!v
}
