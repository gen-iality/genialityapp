import { firestore } from '@/helpers/firebase';
import { IRequestMeenting } from '../interfaces/Landing.interfaces';
import { SpaceMeeting, SpaceMeetingFirebase } from '../interfaces/space-requesting.interface';
import { sortArraySpaceMeetings } from '../utils/space-requesting.utils';

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

export const listeningSpacesRequestMeetings = (eventId: string, userID: string, date: string, onSet: (data: SpaceMeetingFirebase[]) => void) => {
  return firestore
    .collection(`networkingByEventId`)
    .doc(eventId)
    .collection('spacesRequestingByUser')
    .where('userId', '==', userID)
    .where('date', '==', date)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SpaceMeetingFirebase[];
        onSet(sortArraySpaceMeetings(data))
      } else {
        onSet([])
      }
    });
}

export const createSpacesRequestMeetingsWithList = async (eventId: string, spacesRequestMeetings: SpaceMeeting[]) => {
  try {
    spacesRequestMeetings.forEach(async (spaceRequest) => {
      console.log('Creando ', spaceRequest)
      await firestore
        .collection(`networkingByEventId`)
        .doc(eventId)
        .collection('spacesRequestingByUser')
        .doc()
        .set(spaceRequest)
    })
    return true;
  } catch (error) {
    return false;
  }
};
