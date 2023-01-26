import { UseEventContext } from '@/context/eventContext';
import { UseSurveysContext } from '@/context/surveysContext';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Activity, Attendee, EventContext, Survey } from '../types';
import * as services from '../services';

interface AssemblyInCMSContextType {
	activities: Activity[];
	attendeesChecked: number;
	isAssemblyMood: boolean;
	totalAttendees: number;
}

const assemblyInitialValue: AssemblyInCMSContextType = {
	activities: [],
	attendeesChecked: 0,
	isAssemblyMood: false,
	totalAttendees: 0,
};

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	// State
	// Lists
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);
	//
	const [attendeesChecked, setAttendeesChecked] = useState(0);
	const [totalAttendees, setTotalAttendees] = useState(0);
	// Hooks
	const eventContext = UseEventContext() as EventContext;
	console.log('AssemblyInCMSContext:eventContext', eventContext);
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
			getActivities();
			// TODO: Clean -> Just for test prouposes

			// services.listenQuorumByActivity(eventId,)
			return () => {
				unsubscribeSurveys();
				unsubscribeAttendees();
				// TODO: Clean -> Just for test prouposes
			};
		}
		updateAttendees();
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

	const getActivities = async () => {
		try {
			const activities = await services.getActivities(eventId);
			setActivities(activities);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<AssemblyInCMSContext.Provider
			value={{
				activities,
				attendeesChecked,
				isAssemblyMood,
				totalAttendees,
			}}>
			{props.children}
		</AssemblyInCMSContext.Provider>
	);
}
