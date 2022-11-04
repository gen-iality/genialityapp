import { UseUserEvent } from '@/context/eventUserContext';
import { useContext, useEffect, useState } from 'react';
import { WhereIsContext } from '../contexts/WhereIsContext';
import * as service from '../services';

export default function useWhereIs() {
	const cUser = UseUserEvent();
	const [loading, setLoading] = useState(false);
	const context = useContext(WhereIsContext);

	if (context === undefined) throw new Error('Debe estar dentro del WhereIsProvider');

	const { whereIs, setWhereIs } = context;

	useEffect(() => {
		const eventId = cUser.value.event_id;
		if (eventId && whereIs === null) {
			getWhereIs(eventId);
		}
	}, []);

	const getWhereIs = async (eventId: string) => {
		try {
			setLoading(true);
			const whereIs = await service.get(eventId);
			setWhereIs(whereIs);
			console.log(whereIs);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return { whereIs, loading };
}
