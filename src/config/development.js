const _ = require('lodash')
const BaseConfig = require('./_base')

const newConfig = _.merge({}, BaseConfig, {
  server: {
    debug: {
      log: ['error', 'debug'],
      request: '*',
    },
  },
})

module.exports = newConfig
