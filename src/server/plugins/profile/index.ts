import type { Server } from 'server'
import list from "./list"
import action from "./action"

const register = (server: Server) => {
  server.route(list(server))
  server.route(action(server))
  return
}

const plugin = {
  name: 'profile',
  version: '1.0.0',
  register,
}

module.exports = plugin
