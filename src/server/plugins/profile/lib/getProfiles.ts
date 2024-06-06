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
        [Op.eq]: today
      }
    }
  })

  const seenProfilesIds = seenProfiles.map(seenProfile => seenProfile.viewedId)

  const unseenProfiles = await User.findAll({
    where: {
      id: {
        [Op.notIn]: seenProfilesIds
      }
    },
    limit: hasUnlockedLimit ? undefined : 10
  })

  return unseenProfiles
}