import * as Boom from '@hapi/boom'

import AuthTokenRepo from 'database/repositories/authTokenRepo'

import type * as Hapi from '@hapi/hapi'
import type { Server } from 'server'
import dayjs from "server/utils/dayjs";

const validate = async (request: Hapi.Request, token: string) => {
  try {
    const expireAt = await AuthTokenRepo.getExpireAt(token)
    if (!expireAt) {
      throw Boom.badRequest(`Token ${token} does not exist`)
    }
    if (dayjs(expireAt).isBefore(dayjs())) {
      throw Boom.badRequest(`Token ${token} has expired`)
    }

    const user = await AuthTokenRepo.getUserByToken(token)
    console.log("Getting user from token: ", user)
    const credentials = {
      user
    }
    return { isValid: true, credentials }
  } catch (error) {
    return { err: Boom.unauthorized(error.message) }
  }
}

export const register = (server: Server) => {
  server.auth.strategy('auth-token', 'bearer-access-token', {
    validate,
    tokenType: 'Bearer',
  })
  return
}
