import User from './models/User'
import SeenProfile, { SeenProfileActionableType } from './models/SeenProfile'
import AuthToken from "database/models/AuthToken";
import Payment from "database/models/Payment";
import PremiumPackage from "database/models/PremiumPackage";

// Runtime object
export const Models = {
  User,
  SeenProfile,
  AuthToken,
  Payment,
  PremiumPackage
}

// Compile time interface
export type ModelStatics = typeof Models

export type ModelDictionary = Partial<{
  [ModelName in keyof typeof Models]: Array<
    InstanceType<(typeof Models)[ModelName]>
  >
}>

export {
  User,
  SeenProfile,
  AuthToken,
  Payment,
  PremiumPackage
}

export type {
  SeenProfileActionableType
}
