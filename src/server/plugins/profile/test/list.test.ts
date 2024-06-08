import type {ErrorResponse, Server} from "server/type";
import {setupServer, truncateTables} from "server/test/utils";
import type {ServerInjectOptions, ServerInjectResponse} from "@hapi/hapi";
import type User from "database/models/User";
import {expect} from "server/test/unitUtils";
import UserRepo from "database/repositories/userRepo";
import {actionProfile} from "server/plugins/profile/lib/actionProfile";
import {SeenProfileActionableType} from "database/models/SeenProfile";
import AuthTokenRepo from "database/repositories/authTokenRepo";


interface ListProfileOptions extends ServerInjectOptions {
  payload: {
    email?: string
    password?: string
  }
}

interface ListProfileResponse extends ServerInjectResponse {
  result: User[]
}
describe.only('profile list - intergration test', async () => {
  let server: Server, request: ListProfileOptions, payload: any

  beforeEach('setup server and test route', async () => {
    server = await setupServer()
    const userCreds = await UserRepo.createUser('testCreds@example.com', 'nameCreds', '123')

    payload = {}

    request = {
      method: 'GET',
      url: '/profiles',
      auth: {
        credentials: {
          user: userCreds
        },
        strategy: 'default',
      },
      payload
    }
  })

  afterEach( async () => {
    await truncateTables()
  })

  it('should return list of profiles of other users', async () => {
    console.log("Creds: ", request.auth.credentials)
    const response = await server.inject(request) as ListProfileResponse
    expect(response.statusCode).to.equal(200)
    expect(response.result.length).to.not.equal(0)
  })

  it('should error if user has seen all available profiles', async () => {
    const testCredentials = request.auth.credentials.user as User
    const user2 = await UserRepo.createUser('test2@example.com', 'name2', '123')
    const user3 = await UserRepo.createUser('test3@example.com', 'name3', '123')

    await actionProfile(testCredentials.id, user2.id, SeenProfileActionableType.LIKE)
    await actionProfile(testCredentials.id, user3.id, SeenProfileActionableType.LIKE)

    const response = await server.inject(request) as ErrorResponse
    expect(response.statusCode).to.equal(400)
    expect(response.result.message).to.equal('No more available profile to be seen')
  })
})