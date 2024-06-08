import type { Server } from "server"
import {setupServer, truncateTables} from "server/test/utils"
import type { ErrorResponse } from "server/type"
import type {ServerInjectOptions, ServerInjectResponse} from '@hapi/hapi'
import { expect } from "server/test/unitUtils"
import UserRepo from "database/repositories/userRepo"
import type User from "database/models/User"

interface RegisterOptions extends ServerInjectOptions {
  payload: {
    email?: string
    name?: string
    password?: string
  }
}

interface RegisterResponse extends ServerInjectResponse {
  result: {
    user: User
  }
}

describe.only('registerUser - integration test', () => {
  let server: Server, request: RegisterOptions, payload: any

  beforeEach('setup server and test route', async () => {
    server = await setupServer()

    payload = {}

    request = {
      method: 'POST',
      url: '/auth/register',
      payload
    }
  })

  afterEach( async () => {
    await truncateTables()
  })

  describe('validation', () => {
    it('should show validation error if payload is not valid', async () => {
      const response = await server.inject(request) as ErrorResponse

      expect(response.statusCode).to.equal(400)
      expect(response.result.message).to.equal('"email" is required')
    })

    it('should error if email is not valid', async () => {
      request.payload = {
        ...request.payload,
        email: 'test@@sample.cooo',
        name: 'test',
        password: '123',
      }
      const response = await server.inject(request) as ErrorResponse

      expect(response.statusCode).to.equal(400)
      expect(response.result.message).to.equal('"email" must be a valid email')
    })

    it('should error if credentials is already exist', async () => {
      const email = 'test@sample.com'
      const name = 'test'
      const password = 'pass123'
      const user = await UserRepo.createUser(email, name, password)
      request.payload = {
        ...request.payload,
        email: 'test@sample.com',
        name: 'test',
        password: '123',
      }
      const response = await server.inject(request) as ErrorResponse

      expect(response.statusCode).to.equal(400)
      expect(response.result.message).to.equal('User already registered')
    })
  })

  it('should success with correct credentials', async () => {
    const email = 'test@sample.com'
    const name = 'test'
    const password = 'pass123'

    request.payload = {
      email,
      name,
      password,
    }

    const response = await server.inject(request) as RegisterResponse

    expect(response.statusCode).to.equal(200)
    expect(response.result.user).to.not.be.undefined
  })
})