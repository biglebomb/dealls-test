import SeenProfile, {SeenProfileActionableType} from "database/models/SeenProfile"
import dayjs from "server/utils/dayjs";

export const actionProfile = async (viewerId: string, viewedId: string, action: SeenProfileActionableType) => {
  const today = dayjs()
  const getProfile = await SeenProfile.findOne({
    where: {
      viewerId,
      viewedId,
    }
  })

  if(getProfile) {
    const isSeen = dayjs(getProfile.createdAt).isSame(today, 'date')
    if (isSeen) {
      throw new Error('Profile is seen already for today')
    }
  }

  return SeenProfile.create({
    viewerId,
    viewedId,
    actionableType: action
  })
}