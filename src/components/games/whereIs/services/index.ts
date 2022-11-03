import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { CreatePlayerDto, WhereIs } from '../types';

export const get = async (eventId: string) => {
	try {
		const result = await firestore
			.collection('whereIsByEvent')
			.doc(eventId)
			.get();
		console.log(result);
		// return result as WhereIs;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};

export const createPlayer = async (createPlayerDto: CreatePlayerDto) => {
	try {
		const { event_id, event_user_id, ...rest } = createPlayerDto;
		await firestore
			.collection('whereIsByEvent')
			.doc(createPlayerDto.event_id)
			.collection('players')
			.doc(createPlayerDto.event_user_id)
			.set(rest);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};
