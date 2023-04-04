import { firestore } from '@/helpers/firebase';
import { IRequestMeenting } from '../interfaces/Landing.interfaces';

export const getMeetingRequest = async (
  property: string,
  eventId: string,
  userID: string,
  stateMeeting: string[]
) => {
  try {
    const requestMeetings = await firestore
      .collection('networkingByEventId')
      .doc(eventId)
      .collection('meeting_request')
      .where(property, '==', userID)
      .where('status', 'in', stateMeeting)
      .get();
    const data = requestMeetings.docs.map((item) => ({ id: item.id, ...item.data() }));
    return data;
  } catch (error) {
    return false;
  }
};

export const updateRequestMeeting = async (eventId: string, requestId: string, updateRequest: IRequestMeenting) => {
  try {
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('meeting_request')
      .doc(requestId)
      .update(updateRequest);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

  