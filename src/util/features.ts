'use strict'
import chalk from 'chalk'
import { toShortPluginId } from '../util/pluginResolution'

export const formatFeatures = (preset: any, lead?: any, joiner?: any) => {
  const features = exports.getFeatures(preset)
  return features.map((dep: any) => {
    dep = toShortPluginId(dep)
    return `${lead || ''}${chalk.yellow(dep)}`
  }).join(joiner || ', ')
}

export const getFeatures = (preset: any) => {
  const features = []
  if (preset.router) {
    features.push('vue-router')
  }
  if (preset.vuex) {
    features.push('vuex')
  }
  if (preset.cssPreprocessor) {
    features.push(preset.cssPreprocessor)
  }
  const plugins = Object.keys(preset.plugins).filter(dep => {
    return dep !== '@vue/cli-service'
  })
  features.push.apply(features, plugins)
  return features
}
