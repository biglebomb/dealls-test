import { Sequelize } from 'sequelize-typescript'

import * as configs from './config'
import type { SequelizeOptions } from 'sequelize-typescript'

const env = process.env.NODE_ENV || 'development'

const config = (configs as any)[env] as SequelizeOptions

export const loadDatabaseConfig = (): Sequelize => {
  return new Sequelize(config)
}

export default loadDatabaseConfig
