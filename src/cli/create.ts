
'use strict'

const error = console.error
const log = console.log

async function create (projectName: string, options: any) {
  log(projectName, options, ' create')
}

module.exports = (name: string, opts: any) => {
  return create(name, opts).catch((err: any) => {
    error(err)
    process.exit(1)
  })
}
