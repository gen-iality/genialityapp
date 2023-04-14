import { firestore } from '@/helpers/firebase';
import { IRequestMeenting } from '../interfaces/Landing.interfaces';
import { SpaceMeeting, SpaceMeetingFirebase } from '../interfaces/space-requesting.interface';
import firebase from 'firebase/compat';

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

export const listeningSpacesAgendedMeetings = (eventId: string, userID: string, date: string, onSet: (data: SpaceMeetingFirebase[]) => void) => {
  return firestore
    .collection(`networkingByEventId`)
    .doc(eventId)
    .collection('spacesRequestingByUser')
    .where('userId', '==', userID)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SpaceMeetingFirebase[];
        onSet(data)
      } else {
        onSet([])
      }
    });
}

export const createSpacesAgendedMeetings = async (eventId: string, dateStart: string, dateEnd: string, userId: string) => {
  try {
    const newSpaceAgended: SpaceMeeting = {
      userId,
      dateEnd: firebase.firestore.Timestamp.fromDate(new Date(dateEnd)),
      dateStart: firebase.firestore.Timestamp.fromDate(new Date(dateStart)),
      status: 'not_available'
    }
    console.log('newSpaceAgended',newSpaceAgended)
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('spacesRequestingByUser')
      .doc()
      .set(newSpaceAgended);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
};