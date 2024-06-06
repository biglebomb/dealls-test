
import type * as Hapi from '@hapi/hapi'
import type {Server} from "server/type";
import * as Joi from "joi";
import UserRepo from "database/repositories/userRepo";
import * as Boom from "@hapi/boom";
import AuthTokenRepo from "database/repositories/authTokenRepo";
import type User from "database/models/User";
import {omit} from "lodash";
export type LoginRequest = Hapi.Request & {
  payload: {
    email: string,
    password: string
  }
}

export default (_server: Server): Hapi.ServerRoute => {
  return {
    method: 'POST',
    path: '/auth/login',
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      handler: handleRequest
    }
  }
}

interface LoginResponse {
  user: User
  token: string
}

async function handleRequest(req: LoginRequest) {
  const { email, password } = req.payload
  const user = await UserRepo.loginUser(email, password)

  if(!user) {
    throw Boom.unauthorized("Invalid credentials")
  }
  const authToken = await AuthTokenRepo.upsertAuthToken(user.id)

  return { user: omit(user.toJSON(), 'password'), token: authToken.token } as unknown as LoginResponse
}