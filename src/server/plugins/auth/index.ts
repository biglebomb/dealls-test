import * as authToken from './auth-token'
import type { Server } from 'server'

const register = async (server: Server, options: object) => {
  await authToken.register(server)
  return
}

const plugin = {
  name: 'auth',
  version: '1.0.0',
  dependencies: [],
  register,
}

module.exports = plugin
