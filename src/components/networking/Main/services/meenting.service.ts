import { firestore } from '@/helpers/firebase';

export const listenAttendees = (eventId: string, setAttendees: any) => {
	return firestore.collection(`${eventId}_event_attendees`).onSnapshot(snapshot => {
		if (!snapshot.empty) {
			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {};
			setAttendees(data);
		}
	});
};

export const listenMeetings = (eventId: string, setMeetings: any) => {
	return firestore
		.collection(`networkingByEventId`)
		.doc(eventId)
		.collection('meetings').onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {};
        setMeetings(data);
      }
    })
};

export const createMeeting = async (eventId: string, createMeetingDto: any) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('meetings')
			.doc()
			.set(createMeetingDto);
	} catch (error) {
		console.log(error);
	}
};

export const updateMeeting = async (eventId: string, meetingId: string, updateMeetingDto: any) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('meetings')
			.doc(meetingId)
			.update(updateMeetingDto);
	} catch (error) {
		console.log(error);
	}
};

export const deleteMeeting = async (eventId: string, meetingId: string) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('meetings')
			.doc(meetingId)
			.delete();
	} catch (error) {
		console.log(error);
	}
};
