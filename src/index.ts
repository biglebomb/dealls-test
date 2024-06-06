import {createServer} from "server"
import * as v8 from "v8"

const ENV = process.env.NODE_ENV
const Config = require(`./config/${ENV}.js`)

const init = async () => {
  const server = await createServer(Config)
  await server.start()
  server.log(
    ['debug', 'startup'],
    `Server started: ${ENV} - http://${server.info.host}:${server.info.port}
       Heap size limit: ${v8.getHeapStatistics().heap_size_limit}`,
  )
}

init()