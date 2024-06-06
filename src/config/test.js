const _ = require('lodash')
const BaseConfig = require('./_base')

let debug = {
  request: 'error',
}

const newConfig = _.merge({}, BaseConfig, {
  server: {
    debug,
  },
})

module.exports = newConfig