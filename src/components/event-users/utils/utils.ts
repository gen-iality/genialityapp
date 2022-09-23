import moment from 'moment';

/** Sorting to show users with checkIn first in descending order, and users who do not have checkIn as last  */
const sortUsersArray = async (users: {}[]) => {
  const sortedResult = users.sort((itemA: any, itemB: any) => {
    let aParameter = '';
    let bParameter = '';

    try {
      aParameter = itemA?.checkedin_at?.toDate();
      bParameter = itemB?.checkedin_at?.toDate();
    } catch (error) {}

    if (!aParameter) return 1;
    if (!bParameter) return -1;
    if (moment(aParameter) === moment(bParameter)) return 0;
    return moment(aParameter) > moment(bParameter) ? -1 : 1;
  });

  return sortedResult;
};

export const UsersPerEventOrActivity = async (updatedAttendees: [], activityId: string) => {
  let usersInTheActivity: {}[] = [];

  updatedAttendees?.forEach((user: { activityProperties: [] }) => {
    user?.activityProperties?.filter((userInActivity: { _id: string }) => {
      if (activityId && userInActivity?._id === activityId) {
        usersInTheActivity.push({ ...user, ...userInActivity });
      }
    });

    if (activityId) return;
    usersInTheActivity.push({ ...user });
  });

  return await sortUsersArray(usersInTheActivity);
};
