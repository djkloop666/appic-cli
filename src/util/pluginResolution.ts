const pluginRE = /^(@vue\/|vue-|@[\w-]+\/vue-)cli-plugin-/

export const toShortPluginId = (id: string) => id.replace(pluginRE, '')
