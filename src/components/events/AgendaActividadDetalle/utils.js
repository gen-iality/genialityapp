import { Activity, TicketsApi } from '../../../helpers/request';

export function CheckinActiviy(eventId, activityId, eventUser, cUser) {
  try {
    if ((eventUser || cUser) && eventId) {
      TicketsApi.checkInAttendee(eventId, eventUser.value._id);
      Activity.checkInAttendeeActivity(eventId, activityId, cUser.value._id);
    }
  } catch (e) {
    console.error('fallo el checkin:', e);
  }
}
