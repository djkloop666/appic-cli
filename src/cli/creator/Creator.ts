// import * as inquirer from 'inquirer'
import * as EventEmitter from 'events'
import { clearConsole } from '../../util/clearConsole'
import { loadOptions, defaults } from './options'
import { formatFeatures } from '../../util/features'

interface CreatorInterFace {
  name?: string
  targetDir?: string
  create (opts: any, preset: any): void
  run (command: string, args: any): string
}

const log = console.log
const isManualMode = (answers: any) => answers.preset === '__manual__'
export default class Creator extends EventEmitter implements CreatorInterFace {
  name?: string
  ctx?: string
  injectedPrompts?: [] | undefined | any
  presetPrompt?: [] | any
  outroPrompts?: [] | any
  featurePrompt?: []
  constructor (name: string, targetDir: string) {
    super()
    this.name = name
    this.ctx = targetDir
    this.run = this.run.bind(this)
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()
    this.injectedPrompts = featurePrompt
    this.presetPrompt = presetPrompt
    this.outroPrompts = []
    this.featurePrompt = []
  }

  // 构建开始
  async create (opts: any = {}, preset: any = null) {
    const { run, ctx, name } = this
    log(name, run, ctx, preset, 'create')
    if (!preset) {
      if (opts.preset) {
        log('ops')
      } else if (opts.default) {
        log('opts')
      } else {
        preset = await this.promptAndResolvePreset()
      }
    }
  }

  async promptAndResolvePreset (answers: any = null) {
    if (!answers) {
      // clearConsole(true)
      log(this.resolveFinalPrompts())
      // answers = await inquirer.prompt(this.resolveFinalPrompts())
    }
  }

  getPresets () {
    const savedOptions = loadOptions()
    return Object.assign({}, savedOptions.presets, defaults.presets)
  }

  resolveIntroPrompts () {
    const presets = this.getPresets()
    log(presets, ' resolveIntroPrompts')
    const presetChoices = Object.keys(presets).map(name => {
      return {
        name: `${name} (${formatFeatures(presets[name])})`,
        value: name
      }
    })
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices,
        {
          name: 'Manually select features',
          value: '__manual__'
        }
      ]
    }
    const featurePrompt = {
      name: 'features',
      when: isManualMode,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10
    }
    return {
      presetPrompt,
      featurePrompt
    }
  }

  resolveFinalPrompts () {
    // patch generator-injected prompts to only show in manual mode
    this.injectedPrompts.forEach((prompt: any) => {
      const originalWhen = prompt.when || (() => true)
      prompt.when = (answers: any) => {
        return isManualMode(answers) && originalWhen(answers)
      }
    })
    const prompts = [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts,
      ...this.outroPrompts
    ]
    return prompts
  }

  run (command: string, args: any) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return ''
  }
}
