import type { Server } from 'server'
import loginUser from "./loginUser";
import registerUser from "./registerUser"

const register = (server: Server) => {
  server.route(loginUser(server))
  server.route(registerUser(server))
  return
}

const plugin = {
  name: 'user',
  version: '1.0.0',
  register,
}

module.exports = plugin
