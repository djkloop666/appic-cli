'use strict'
import * as fs from 'fs-extra'
import { validate, createSchema } from '../../util/validate'
import { getRcPath } from '../../util/rcPath'

const exit = process.exit
const error = console.error
let cachedOptions: any
const presetSchema = createSchema((joi: any) => joi.object().keys({
  bare: joi.boolean(),
  useConfigFiles: joi.boolean(),
  router: joi.boolean(),
  routerHistoryMode: joi.boolean(),
  vuex: joi.boolean(),
  cssPreprocessor: joi.string().only(['sass', 'less', 'stylus']),
  plugins: joi.object().required(),
  configs: joi.object()
}))

const rcPath = exports.rcPath = getRcPath('.appicrc')

const schema = createSchema((joi: any) => joi.object().keys({
  packageManager: joi.string().only(['yarn', 'npm']),
  useTaobaoRegistry: joi.boolean(),
  presets: joi.object().pattern(/^/, presetSchema)
}))
export const loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
    } catch (e) {
      error(
        `Error loading saved preferences: ` +
        `~/.appicrc may be corrupted or have syntax errors. ` +
        `Please fix/delete it and re-run appic-cli in manual mode.\n` +
        `(${e.message})`
      )
      exit(1)
    }

    validate(cachedOptions, schema, () => {
      error(
        `~/.appicrc may be outdated. ` +
        `Please delete it and re-run appic-cli in manual mode.`
      )
    })
    return cachedOptions
  } else {
    return {}
  }
}

export const defaultPreset = {
  router: false,
  vuex: false,
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save']
    }
  }
}

export const defaults = {
  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    'default': exports.defaultPreset
  }
}
