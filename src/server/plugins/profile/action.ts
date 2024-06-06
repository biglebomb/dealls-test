import type {AuthenticatedRequest, Server} from "server/type";
import type * as Hapi from "@hapi/hapi";
import * as Joi from "joi";
import {getProfiles} from "server/plugins/profile/lib/getProfiles";
import {SeenProfileActionableType} from "database/models/SeenProfile";
import {actionProfile} from "server/plugins/profile/lib/actionProfile";
import * as Boom from "@hapi/boom";

interface ActionProfileRequest extends AuthenticatedRequest {
  payload: {
    actionableType: SeenProfileActionableType
    userId: string
  }
}

export default (_server: Server): Hapi.ServerRoute => {
  return {
    method: 'POST',
    path: '/profiles',
    options: {
      auth: {
        strategies: ['auth-token']
      },
      validate: {
        payload: {
          actionableType: Joi.string().valid(...Object.values(SeenProfileActionableType)).required(),
          userId: Joi.string().required(),
        },
      },
      handler: handleRequest
    }
  }
}

async function handleRequest(req: ActionProfileRequest) {
  try {
    const {user} = req.auth.credentials

    const action = await actionProfile(user.id, req.payload.userId, req.payload.actionableType)

    return action
  } catch (e) {
    throw Boom.badRequest(e)
  }
}