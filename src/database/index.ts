import loadDatabaseConfig from './loadConfig'
import type { ModelStatics } from './models'
import { Models } from './models'
import type { Sequelize } from 'sequelize-typescript'

export interface Database extends ModelStatics {
  sequelize: Sequelize
}

export const createDatabaseConnection = async (): Promise<Database> => {
  const sequelize = loadDatabaseConfig()
  sequelize.addModels([...Object.values(Models)])
  return { sequelize, ...Models }
}

export default createDatabaseConnection
