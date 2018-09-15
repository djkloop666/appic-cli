'use strict'
import * as readline from 'readline'

export const clearConsole = (title?: string) => {
  console.log('我被触发了!!!!!!')
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows as number)
    console.log('正大光明')
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) console.log(title)
  }
}
