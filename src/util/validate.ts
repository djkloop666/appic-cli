'use strict'
const exit = process.exit
export const validate = (obj: any, schema: any, cb: any) => {
  require('joi').validate(obj, schema, {}, (err: any) => {
    if (err) {
      cb(err.message)
      if (process.env.VUE_CLI_TEST) {
        throw err
      } else {
        exit(1)
      }
    }
  })
}

export const createSchema = (fn: any) => fn(require('joi'))
