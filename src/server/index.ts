import * as Boom from '@hapi/boom'
import * as Glue from '@hapi/glue'
import * as Path from "node:path";
import createDatabaseConnection from "database"
import type { Server } from "./type"

let serverSingleton: Server

export const getServerSingleton = () => {
  if (!serverSingleton) {
    throw new Error('Server not set up')
  }
  return serverSingleton
}

export const createServer = async (config: any): Promise<Server> => {
  console.log(config.register.plugins)
  const server = (await Glue.compose(config, {
    relativeTo: Path.resolve(`${__dirname}/plugins`),
  })) as Server

  server.db = await createDatabaseConnection()

  server.route({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/{path*}',
    options: {
      auth: false,
    },
    handler: () => {
      throw Boom.notFound('Cannot find the requested resource')
    },
  })

  serverSingleton = server

  return server
}

export type { Server }

export default createServer