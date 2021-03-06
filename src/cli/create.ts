/// <reference path="../..//typings/index.d.ts" />

'use strict'
import * as validateProjectName from 'validate-npm-package-name'
import * as path from 'path'
import chalk from 'chalk'
import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import Creator from './creator/Creator'
import { clearConsole } from '../util/clearConsole'

const error = console.error
const log = console.log
const exit = process.exit

interface InquirerInterFace {
  action?: any
}

async function create (projectName: string, options: any) {
  // 处理路径
  const cwd: string = options.cwd || process.cwd()
  const inCurrent: boolean = projectName === '.'
  const name: string = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir: string = path.resolve(cwd, projectName || '')
  // 查看文件名是否合格
  const result = validateProjectName(name)
  if (!(result as any).validForNewPackages) {
    error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors && result.errors.forEach(err => {
      error(chalk.red(err))
    })
    exit(1)
  }

  // 判断是否存在同名目录
  if (fs.existsSync(targetDir)) {
    await clearConsole()
    const { action }: InquirerInterFace = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
        choices: [
          {
            name: 'Overwrite',
            value: 'overwrite'
          },
          {
            name: 'Merge',
            value: 'merge'
          },
          {
            name: 'Cancel',
            value: false
          }
        ]
      }
    ])
    // 如果没有选择直接退出
    if (!action) return
    // 如果选择的是覆盖则需要优先删除以前的旧文件
    if (action === 'overwrite') {
      log(`\nRemoving ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }
  // 开始构建
  const creator = new Creator(name, targetDir)
  await creator.create(options)

}

module.exports = (name: string, opts: any) => {
  return create(name, opts).catch((err: any) => {
    error(err)
    exit(1)
  })
}
