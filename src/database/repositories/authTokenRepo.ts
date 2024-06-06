import { v4 as uuidv4 } from 'uuid'

import AuthToken from 'database/models/AuthToken'
import dayjs from "server/utils/dayjs";
import User from "database/models/User";

export default class AuthTokenRepo {
  static upsertAuthToken = async (
    userId: string,
  ): Promise<AuthToken> => {
    const authToken = await AuthToken.findOne({
      where: { userId },
    })

    if (authToken) {
      await authToken.update({
        expiredAt: dayjs().add(60, 'minutes'),
        updatedAt: dayjs(),
      })

      return authToken
    }

    return await AuthToken.create({
      userId,
      token: uuidv4(),
      expiredAt: dayjs().add(60, 'minutes'),
      createdAt: dayjs(),
    })
  }

  static getExpireAt = async (token: string) => {
    const authToken = await AuthToken.findOne({ where: { token } })
    if (!authToken) {
      return null
    }
    return authToken.expiredAt
  }

  static getUserByToken = async (token: string) => {
    const authToken = await AuthToken.findOne({ where: { token }, include: { model: User } })
    if (!authToken) {
      return null
    }
    return authToken.User
  }
}
