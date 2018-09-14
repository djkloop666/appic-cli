#!/usr/bin/env node
import chalk from 'chalk'
import * as program from 'commander'
import * as semver from 'semver'
const appicPkg = require('../../package.json')
const log = console.log

const appicPkgNodeVersion = appicPkg.engines.node

function checkNodeVersion (wanted: string, id: string) {
  if (!semver.satisfies(process.version, wanted)) {
    log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}
checkNodeVersion(appicPkgNodeVersion, 'appic-cli')
program
  .version(appicPkg.version, '-v, --version')
  .usage(
    `<command> [option] \n
    ${chalk.greenBright('🤣🤣🤣 An application for AppicPlay ordering -')} ${chalk.redBright(appicPkg.version)} 🎉🎉🎉
    `
  )

// create
program
  .command('create <app-name>')
  .description('create a new project powered by appic-cli-admin-manager')
  .option('-d', '--default', 'Skip prompts and use default preset')
  .action((name, cmd) => {
    const opts = cleanArgs(cmd)
    require('../cli/create')(name, opts)
  })

program.parse(process.argv)

function cleanArgs (cmd: any) {
  const args = {}
  cmd.options.forEach((o: any) => {
    const key = o.long.replace(/^--/, '')
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
