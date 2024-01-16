import { createContext, useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EventsApi, eventTicketsApi } from '../helpers/request';
import NotFoundPage from '../components/notFoundPage';

export const CurrentEventContext = createContext();

export function CurrentEventProvider({ children, history, match }) {
	let { event_id, event_name, event } = useParams();
	/* ('params=>>', useParams()); */
	let eventNameFormated = null;
	let initialContextState = { status: 'LOADING', value: null, nameEvent: '' };

	if (event_name) {
		eventNameFormated = event_name.replaceAll('---', 'more');
		eventNameFormated = eventNameFormated.replaceAll('-', '%20');
		eventNameFormated = eventNameFormated.replaceAll('more', '"-"');
		initialContextState = { error: null, status: 'LOADING', value: null, nameEvent: event_name };
	}

	const [eventContext, setEventContext] = useState(initialContextState);
	// console.log('eventContext',eventContext);

	useEffect(() => {
		async function fetchEvent(type) {
			let eventGlobal;
			let dataevent;
			switch (type) {
				case 'id':
					try {	
					eventGlobal = await EventsApi.getOne(event_id || event);
					const value = {
						...eventGlobal,
						is_finalized: eventGlobal?.is_finalized ?? false ,
						extended_date: eventGlobal?.extended_date ?? null
					}
					dataevent = { status: 'LOADED', value, nameEvent: event_id || event, isByname: false };
					} catch (error) {
						history.push(`${match.url || 'absolute'}/notfound`)
					}
					break;

				case 'name':
					eventGlobal = await EventsApi.getOneByNameEvent(eventNameFormated);
					dataevent = { status: 'LOADED', value: eventGlobal.data[0], nameEvent: event_name, isByname: true };
					/* console.log('evne', eventGlobal.data[0]); */
					break;

				case 'eventadmin':
					eventGlobal = await EventsApi.getOne(event);
					const value = {
						...eventGlobal,
						is_finalized: eventGlobal?.is_finalized ?? false ,
						extended_date: eventGlobal?.extended_date ?? null
					}

					dataevent = {
						status: 'LOADED',
						value,
						nameEvent: event_id || event,
						idEvent: event,
						isByname: false,
					};
					break;
			}
			setEventContext(dataevent);
		}

		/* console.log('event_id', event_id); */

		if (event_id) {
			fetchEvent('id');
		} else if (event_name) {
			fetchEvent('name');
		} else if (event) {
			fetchEvent('eventadmin');
		}
	}, [event_id, event_name, event]);

	return (
		<CurrentEventContext.Provider value={eventContext}>
			{eventContext && eventContext.error && <NotFoundPage />}
			{eventContext && !eventContext.error && <>{children}</>}
		</CurrentEventContext.Provider>
	);
}

export function UseEventContext() {
	const contextevent = useContext(CurrentEventContext);
	if (!contextevent) {
		console.log('me mori');
		throw new Error('eventContext debe estar dentro del proveedor');
	}

	return contextevent;
}
