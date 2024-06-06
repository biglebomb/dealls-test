import type * as Hapi from '@hapi/hapi'
import type { ServerInjectResponse } from '@hapi/hapi'
import type { Database } from "database"
import type User from "database/models/User";

export interface RequestAuthUser extends Hapi.RequestAuth {
  credentials: {
    user: User
  }
}

export interface AuthenticatedRequest extends Hapi.Request {
  auth: RequestAuthUser
}

export interface Server extends Hapi.Server {
  db: Database
}

export interface ErrorResponse extends Hapi.ServerInjectResponse {
  result: {
    message: string
  }
}

export interface ServerResponse<Result extends object>
  extends ServerInjectResponse {
  result: Result
}
