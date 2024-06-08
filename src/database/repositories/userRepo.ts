import User from "database/models/User"
import * as bcrypt from 'bcrypt'

export default class UserRepo {
  static getUser = async (email: string) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return null
    }
    return user
  }

  static createUser = async (email: string, name: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, name, password: hashedPassword })
    return user
  }

  static loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return null
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null
    }

    return user
  }
}