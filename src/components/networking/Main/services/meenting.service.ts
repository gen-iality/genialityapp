import { firestore } from '@/helpers/firebase';

export const getMeentings = () => {};

export const getAttendees = (eventId: string, setAttendees: any) => {
	return firestore.collection(`${eventId}_event_attendees`).onSnapshot(snaphot => {
		if (!snaphot.empty) {
			const data = snaphot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {};
			setAttendees(data);
		}
	});
};

export const createMeeting = async (eventId: string, createMeetingDto: any) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('meetings')
			.doc()
			.set(createMeeting);
	} catch (error) {
		console.log(error);
	}
};
