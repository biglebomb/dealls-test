import type { Server } from "server"
import {setupServer, truncateTables} from "server/test/utils";
import type {AuthenticatedRequest, ErrorResponse} from "server/type";
import type {ServerInjectOptions, ServerInjectResponse} from '@hapi/hapi'
import { expect } from "server/test/unitUtils";
import UserRepo from "database/repositories/userRepo";
import type User from "database/models/User";

interface LoginOptions extends ServerInjectOptions {
  payload: {
    email?: string
    password?: string
  }
}

interface LoginResponse extends ServerInjectResponse {
  result: {
    user: User
  }
}

describe('loginUser - integration test', () => {
  let server: Server, request: LoginOptions, payload: any

  beforeEach('setup server and test route', async () => {
    server = await setupServer()

    payload = {}

    request = {
      method: 'POST',
      url: '/auth/login',
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
        password: '123',
      }
      const response = await server.inject(request) as ErrorResponse

      expect(response.statusCode).to.equal(400)
      expect(response.result.message).to.equal('"email" must be a valid email')
    })

    it('should error if credentials are not valid', async () => {
      request.payload = {
        ...request.payload,
        email: 'test@sample.com',
        password: '123',
      }
      const response = await server.inject(request) as ErrorResponse

      expect(response.statusCode).to.equal(401)
      expect(response.result.message).to.equal('Invalid credentials')
    })
  })

  it('should success with correct credentials', async () => {
    const email = 'test@sample.com'
    const name = 'test'
    const password = 'pass123'
    const user = await UserRepo.createUser(email, name, password)

    request.payload = {
      email,
      password,
    }

    const response = await server.inject(request) as LoginResponse

    expect(response.statusCode).to.equal(200)
    expect(response.result.user.id).to.equal(user.id)
  })
})