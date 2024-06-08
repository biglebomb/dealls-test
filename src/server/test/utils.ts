// disable console log linting rule because this is test environment
/* eslint-disable no-console */
import {faker} from '@faker-js/faker'
import * as _ from 'lodash'

import * as Config from 'config/test'
import {rollback} from 'server/utils/transactions'
import type {Server} from '../index'
import {createServer} from '../index'
import type {Sequelize, Transaction} from 'sequelize'
import UserRepo from "database/repositories/userRepo";
import type User from "database/models/User";

let server: Server | undefined

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const getServerInstance = (): Server => {
  if (!server) {
    throw new Error('Server not setup correctly, please check your test code')
  }
  return server
}

before('setup server (test root)', async function () {
  this.timeout(30000)
  setTimeout(() => {
    console.log('30 secs passed, failing test')
  }, 30000)
  faker.seed(1)
  server = await setupServer()
  console.log('Server setup successful in test root!')
})

after('tear down server', async () => {
  console.log('Tearing down server...')
  await closeServer()
  console.log('Server teardown successful!')
})

const getSequelizeInstance = (sql?: Sequelize | undefined): Sequelize => {
  if (sql) {
    return sql
  }
  const svr = getServerInstance()
  return svr.db.sequelize
}

export const truncateTables = async (sql?: Sequelize) => {
  const sequelize = getSequelizeInstance(sql)

  const tableNames = _.map(_.values(sequelize.models), 'tableName')

  const tableNamesString = _.map(
    tableNames,
    (tableName) => `"${tableName}"`,
  ).join(', ')

  try {
    await sequelize.query('TRUNCATE TABLE ' + tableNamesString + ' CASCADE')
  } catch (error) {
    if (error && error.message.toLowerCase().includes('deadlock')) {
      await sleep(500)
      await truncateTables(sql)
      return
    }
    throw error
  }
  return
}

export const setupServer = async (): Promise<Server> => {
  if (!server) {
    console.log('Setting up server...')
    server = await createServer(Config)
    console.log('Server setup successful!')
    return server
  }
  return server
}

export const cleanupTransaction = async (transaction: Transaction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((transaction as any).finished !== 'commit') {
    await rollback(transaction)
  }
}

export const closeServer = async () => {
  const svr = getServerInstance()
  await svr.db.sequelize.close()
  await svr.stop()
  server = undefined
}