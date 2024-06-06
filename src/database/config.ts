import type { SequelizeOptions } from 'sequelize-typescript'
require('dotenv').config()

// need to cast as seederStorage is not defined in SequelizeOptions
const baseConfig = {
  dialect: 'postgres',
  port: 5432,
  pool: {
    max: 25,
    min: 0,
    idle: 20000,
    acquire: 90000,
  },
  minifyAliases: true,
  seederStorage: 'sequelize',
  benchmark: true,
} as SequelizeOptions

function removeUndefined(obj: Record<string, any>) {
  for (const k in obj) {
    if (obj[k] === undefined) {
      delete obj[k]
    }
  }
  return obj
}

const configs: Record<string, SequelizeOptions> = {
  development: {
    ...baseConfig,
    ...removeUndefined({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    }),
  },
  test: {
    ...baseConfig,
    ...removeUndefined({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    }),
    database: 'test',
    logging: false,
  },
}

// due to how sequelize-cli works, we need to use module.exports instead
// of export default
module.exports = configs
