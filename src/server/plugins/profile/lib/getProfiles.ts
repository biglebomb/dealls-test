import dayjs from "server/utils/dayjs";
import SeenProfile from "database/models/SeenProfile";
import {Op} from "sequelize";
import User from "database/models/User";

export const getProfiles = async (userId: string, hasUnlockedLimit: boolean) => {
  const today = dayjs().toDate()

  const seenProfiles = await SeenProfile.findAll({
    where: {
      viewerId: userId,
      createdAt: {
        [Op.lte]: today
      }
    }
  })

  const seenProfilesIds = seenProfiles
    .map(seenProfile => seenProfile.viewedId)

  const unseenProfiles = await User.findAll({
    where: {
      id: {
        [Op.notIn]: seenProfilesIds,
        [Op.ne]: userId
      }
    },
    limit: hasUnlockedLimit ? undefined : 10
  })

  if(unseenProfiles.length === 0) {
    throw new Error('No more available profile to be seen')
  }

  return unseenProfiles
}