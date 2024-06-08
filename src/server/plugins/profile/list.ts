import type {AuthenticatedRequest, Server} from "server/type";
import type * as Hapi from "@hapi/hapi";
import * as Joi from "joi";
import {getProfiles} from "server/plugins/profile/lib/getProfiles";
import * as Boom from "@hapi/boom";

export default (_server: Server): Hapi.ServerRoute => {
  return {
    method: 'GET',
    path: '/profiles',
    options: {
      auth: {
        strategies: ['auth-token']
      },
      handler: handleRequest
    }
  }
}

async function handleRequest(req: AuthenticatedRequest) {
  const { user } = req.auth.credentials

  console.log("Creds in file: ", req.auth.credentials)

  try {
    const profiles = await getProfiles(user.id, false)

    return profiles
  } catch (e) {
    throw Boom.badRequest(e)
  }
}