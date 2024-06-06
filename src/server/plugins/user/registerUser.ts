
import type * as Hapi from '@hapi/hapi'
import type {Server} from "server/type";
import * as Joi from "joi";
import * as Boom from "@hapi/boom";
import {omit} from 'lodash';
import UserRepo from "database/repositories/userRepo";
import AuthTokenRepo from "database/repositories/authTokenRepo";
import type User from "database/models/User";
export type LoginRequest = {
  payload: {
    email: string,
    name: string,
    password: string
  }
}

export default (_server: Server): Hapi.ServerRoute => {
  return {
    method: 'POST',
    path: '/auth/register',
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          name: Joi.string().required(),
          password: Joi.string().required()
        }
      },
      handler: handleRequest
    }
  }
}

interface RegisterResponse {
  user: User
  token: string
}

async function handleRequest(req: LoginRequest) {
  const { email, name, password } = req.payload
  let user = await UserRepo.getUser(email)
  if(user) {
    throw Boom.badRequest("User already registered")
  }
  user = await UserRepo.createUser(email, name, password)
  const authToken = await AuthTokenRepo.upsertAuthToken(user.id)

  return { user: omit(user.toJSON(), 'password'), token: authToken.token } as unknown as RegisterResponse
}