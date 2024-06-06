import type {AuthenticatedRequest, Server} from "server/type";
import type * as Hapi from "@hapi/hapi";
import * as Joi from "joi";
import {getProfiles} from "server/plugins/profile/lib/getProfiles";

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

  const profiles = await getProfiles(user.id, false)

  return profiles.map(profile => profile.id)
}