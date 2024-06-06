import * as AuthBearerTokenScheme from 'hapi-auth-bearer-token'
import * as strategy from './strategy'
import type { Server } from 'server'
import type {Plugin} from "@hapi/hapi";

export const register = async (server: Server) => {
  await server.register(AuthBearerTokenScheme as unknown as Plugin<{}>)
  strategy.register(server)
  return
}
