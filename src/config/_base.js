/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const Path = require("path")
const Joi = require("joi")

const Registrations = require('./_registrations')

const baseConfig = {
  server: {
    port: process.env.PORT || 10000,
    debug: {
      log: ['error', 'debug'],
    },
    app: {
      root: Path.resolve(__dirname, '..'),
      apiPrefix: process.env.API_PREFIX || '/',
      cookieSettings: {
        ttl: null,
        isSecure: false,
        isHttpOnly: true,
        clearInvalid: false,
        path: '/',
      },
    },
    state: {
      ignoreErrors: true,
    },
    router: {
      stripTrailingSlash: true,
      isCaseSensitive: false,
    },
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['accept-language'],
      },
      validate: {
        failAction: async (request, h, err) => {
          console.error(err)
          throw err
        },
        validator: Joi,
      },
    },
  },

  register: {
    plugins: [
      { plugin: require('@hapi/basic') },
      {
        plugin: './auth',
      },
        ...Registrations,
    ],
  },
}

module.exports = baseConfig