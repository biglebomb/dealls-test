import { faker } from '@faker-js/faker'
import moment = require('moment')
import * as sinon from 'sinon'

import AuthTokenRepo from 'database/repositories/authTokenRepo'
import { expect } from 'server/test/unitUtils'
import { setupServer } from 'server/test/utils'

import type { Server } from 'server'
import type {ErrorResponse} from "server/type";

describe('auth - auth token', () => {
  let server: Server

  before('setup server and test route', async () => {
    server = await setupServer()
    server.route({
      method: 'GET',
      path: '/test-route',
      options: {
        auth: {
          strategies: ['auth-token'],
        },
      },
      handler: (req, h) => h.response().code(200),
    })
  })

  afterEach('clean stub', () => {
    sinon.restore()
  })

  it('returns 401 if no token present', async () => {
    const response = (await server.inject({
      method: 'GET',
      url: '/test-route',
    })) as ErrorResponse

    expect(response.statusCode).to.equal(401)
    expect(response.result.message).to.equal('Missing authentication')
  })

  it('returns 401 if no token is found, or if token is expired', async () => {
    sinon.stub(AuthTokenRepo, 'getExpireAt').resolves(null)
    const token = faker.datatype.uuid()

    const response = (await server.inject({
      method: 'GET',
      url: '/test-route',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })) as ErrorResponse

    expect(response.statusCode).to.equal(401)
    expect(response.result.message).to.equal('Bad token')
  })

  it('returns 200 if token exist and is still valid', async () => {
    const token = faker.datatype.uuid()
    sinon
      .stub(AuthTokenRepo, 'getExpireAt')
      .resolves(moment().add(10, 'days').toDate())

    const response = await server.inject({
      method: 'GET',
      url: `/test-route`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).to.equal(200)
  })
})
