'use strict'
import * as readline from 'readline'
const log = console.log

export const clearConsole = (title?: string | boolean) => {
  log(process.stdout.isTTY)
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows as number)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) console.log(title)
  }
}
