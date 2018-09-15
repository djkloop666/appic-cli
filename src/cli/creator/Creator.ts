import * as EventEmitter from 'events'

interface CreatorInterFace {
  name?: string
  targetDir?: string
  create (opts: any, preset: any): void
  run (command: string, args: any): string
}

const log = console.log

export default class Creator extends EventEmitter implements CreatorInterFace {
  name?: string
  ctx?: string
  constructor (name: string, targetDir: string) {
    super()
    this.name = name
    this.ctx = targetDir
    this.run = this.run.bind(this)
  }

  // 构建开始
  async create (opts: any = {}, preset = null) {
    const { run, ctx, name } = this
    log(name, run, ctx)
    if (!preset) {
      if (opts.preset) {

      } else if (opts.default) {
        log('opts')
      }
    }

  }

  run (command: string, args: any) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return ''
  }
}
