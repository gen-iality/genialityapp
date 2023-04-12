import { firestore } from '@/helpers/firebase';
import { IMeeting } from '../interfaces/Meetings.interfaces';
import { ISpaces, ISpacesFirebase } from '../interfaces/spaces-interfaces';

export const listenAttendees = (eventId: string, setAttendees: any) => {
  return firestore.collection(`${eventId}_event_attendees`).onSnapshot((snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as {};
      setAttendees(data);
    } else {
      setAttendees([]);
    }
  });
};

export const GetMeetingsByPagination = async (eventId: string, Pagination : any) => {
  try {
    const querySnapshot = await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('meetings')
      .orderBy('start')
      .startAfter(Pagination)
      .get();

    return {
	  FirtsVisible :querySnapshot.docs[0],
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
      data: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  } catch (error) {
    console.log(error);
    return { lastVisible: null, data: [] };
  }
};
export const listenMeetings = (eventId: string, setMeetings: any) => {
  return firestore
    .collection(`networkingByEventId`)
    .doc(eventId)
    .collection('meetings')
    .orderBy('start','asc')
    .onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as {};
        setMeetings(data);
      } else {
        setMeetings([]);
      }
    });
};
//todo: mejorar el filtro de reuniones with user
export const listenMeetingsByUserLanding = (eventId: string, userID: string, setMeetingWithUser: (meetingList: IMeeting[]) => void) => {
	return firestore
		.collection(`networkingByEventId`)
		.doc(eventId)
		.collection('meetings')
		.onSnapshot(snapshot => {
			if (!snapshot.empty) {
				const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IMeeting[];
				const meetingsWithUserID = data.filter(meeting => meeting.participants.find(participant => participant.id === userID) !== undefined &&
					meeting.participants.length <= 2);
				setMeetingWithUser(meetingsWithUserID)
			} else {
				setMeetingWithUser([])
			}
		});

}
export const listenSpacesByEventId = (eventId: string, setSpaces: (spaces: ISpacesFirebase[]) => void) => {
  return firestore
    .collection(`networkingByEventId`)
    .doc(eventId)
    .collection('spaces-meetings')
    .onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ISpacesFirebase[];
        setSpaces(data);
      } else {
        setSpaces([]);
      }
    });
};

export const createSpacesByEventId = async (eventId: string, createMeetingDto: ISpaces) => {
  try {
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('spaces-meetings')
      .doc()
      .set(createMeetingDto);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const deleteSpacesByEventId = async (eventId: string, spaceId: string) => {
  try {
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('spaces-meetings')
      .doc(spaceId)
      .delete();
    return true;
  } catch (error) {
    return false;
  }
};
export const createMeeting = async (eventId: string, createMeetingDto: Omit<IMeeting, 'id'>) => {
  try {
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('meetings')
      .doc()
      .set(createMeetingDto);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateMeeting = async (eventId: string, meetingId: string, updateMeetingDto: Omit<IMeeting, 'id'>) => {
  try {
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('meetings')
      .doc(meetingId)
      .update(updateMeetingDto);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteMeeting = async (eventId: string, meetingId: string) => {
  try {
    console.log('Epa eliminando', eventId, meetingId);
    await firestore
      .collection(`networkingByEventId`)
      .doc(eventId)
      .collection('meetings')
      .doc(meetingId)
      .delete();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
