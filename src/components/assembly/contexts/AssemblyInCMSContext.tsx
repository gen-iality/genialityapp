import { UseEventContext } from '@/context/eventContext';
import { UseSurveysContext } from '@/context/surveysContext';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Attendee, EventContext, Survey } from '../types';
import * as services from '../services';

interface AssemblyInCMSContextType {
	attendeesChecked: number;
	totalAttendees: number;
}

const assemblyInitialValue = {
	attendeesChecked: 0,
	totalAttendees: 0,
};

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	// State
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [attendeesChecked, setAttendeesChecked] = useState(0);
	const [totalAttendees, setTotalAttendees] = useState(0);
	// Hooks
	const eventContext = UseEventContext() as EventContext;
	// console.log('AssemblyInCMSContext:eventContext', eventContext);
	// Constants
	const eventId = eventContext.idEvent;
	const isAssemblyMood = useMemo(
		() => eventContext.value.user_properties.some(userProperty => userProperty.type === 'voteWeight'),
		[eventContext.status]
	);

	useEffect(() => {
		// getAllSurveys();
		if (eventId) {
			const unsubscribeSurveys = services.surveysListener(eventId, surveys, setSurveys);
			const unsubscribeAttendees = services.attendeesListener(eventId, attendees, setAttendees);
			return () => {
				unsubscribeSurveys();
				unsubscribeAttendees();
			};
		}
		updateAttendees()
	}, []);

	// Effect to update attendees
	useEffect(() => {
		if (!!attendees.length) {
			updateAttendees();
		}
		console.log({ attendeesChecked, totalAttendees });
	}, [attendees]);

	const updateAttendees = () => {
		const totalAttendees = attendees.length;
		const attendeesChecked = attendees.filter(attendee => attendee.checked_in === true).length;
		setTotalAttendees(totalAttendees);
		setAttendeesChecked(attendeesChecked);
	};

	return (
		<AssemblyInCMSContext.Provider
			value={{
				attendeesChecked,
				totalAttendees,
			}}>
			{props.children}
		</AssemblyInCMSContext.Provider>
	);
}
