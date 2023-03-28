import { firestore } from '@/helpers/firebase';
import { IObserver, ITypeMeenting } from '../interfaces/configurations.interfaces';

export const listenObervers = (eventId: string, setObervers: any) => {
	return firestore
		.collection(`networkingByEventId`)
		.doc(eventId)
		.collection('obervers').onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {};
        setObervers(data);
      } else {
		setObervers([])
	  }
    })
};

export const creatObserver = async (eventId: string, createOberverDto: Omit<IObserver,'id'>) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('obervers')
			.doc()
			.set(createOberverDto);
			return true
	} catch (error) {
		console.log(error);
		return false
	}
};



export const deleteObserver = async (eventId: string, observerId: string) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('obervers')
			.doc(observerId)
			.delete();
			return true
	} catch (error) {
		console.log(error);
		return false
	}
};


export const listenTypesMeentings = (eventId: string, setObervers: any) => {
	return firestore
		.collection(`networkingByEventId`)
		.doc(eventId)
		.collection('typesMeenting').onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as {};
        setObervers(data);
      } else {
		setObervers([])
	  }
    })
};

export const creatType = async (eventId: string, createTypeDto: Omit<ITypeMeenting, 'id'>)=> {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('typesMeenting')
			.doc()
			.set(createTypeDto);
			return true
	} catch (error) {
		console.log(error);
		return false
	}
};



export const deleteType = async (eventId: string, typeId: string) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('typesMeenting')
			.doc(typeId)
			.delete();
			return true
	} catch (error) {
		console.log(error);
		return false
	}
};
export const updateType= async (eventId: string, typeId: string, updateTypeDto: Omit<ITypeMeenting, 'id'>) => {
	try {
		await firestore
			.collection(`networkingByEventId`)
			.doc(eventId)
			.collection('typesMeenting')
			.doc(typeId)
			.update(updateTypeDto);
		return true
	} catch (error) {
		console.log(error);
		return false
	}
};
