import { UseEventContext } from '@/context/eventContext';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Activity, Attendee, EventContext, GraphicTypeResponse, Question, Survey } from '../types';
import * as services from '../services';
import { GraphicsData, VoteResponse } from '@/components/events/surveys/types';

interface AssemblyInCMSContextType {
	activities: Activity[];
	attendeesChecked: number;
	isAssemblyMood: boolean;
	totalAttendees: number;
	surveys: Survey[];
	listenQuorum: (
		activityId: Activity['_id'],
		setAttendeesState: React.Dispatch<
			React.SetStateAction<{
				online: number;
				visited: number;
				weight: number;
			}>
		>
	) => void;
	listenAnswersQuestion: (
		surveyId: string,
		questionId: string,
		setGraphicsData: React.Dispatch<React.SetStateAction<GraphicsData>>,
		setResponses?: React.Dispatch<React.SetStateAction<VoteResponse[]>>
	) => () => void;
	totalAttendeesWeight: number;
	loading: boolean;
	updateAttendees: () => void;
	getAdditionalDataBySurvey: (surveyId: string) => Promise<{ questions: Question[]; graphicType: GraphicTypeResponse }>;
	getActivities: () => Promise<void>;
}

const assemblyInitialValue: AssemblyInCMSContextType = {} as AssemblyInCMSContextType;

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	// Lists
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);
	// State
	const [attendeesChecked, setAttendeesChecked] = useState(0);
	const [totalAttendees, setTotalAttendees] = useState(0);
	const [totalAttendeesWeight, setTotalAttendeesWeight] = useState(0);
	const [loading, setLoading] = useState(true);
	// Hooks
	const eventContext = UseEventContext() as EventContext;
	// Constants
	const eventId = eventContext.idEvent;
	const isAssemblyMood = useMemo(
		() => eventContext.value.user_properties.some(userProperty => userProperty.type === 'voteWeight'),
		[eventContext.status]
	);

	// console.log('surveys', surveys);

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
		setLoading(false);
	}, []);

	// Effect to update attendees
	useEffect(() => {
		if (!!attendees.length) {
			updateAttendees();
		}
		// console.log({ attendeesChecked, totalAttendees });
	}, [attendees]);

	const updateAttendees = () => {
		const totalAttendees = attendees.length;
		const attendeesChecked = attendees.filter(attendee => attendee.checked_in === true).length;
		const totalAttendeesWeight = attendees.reduce((acc, attendee) => {
			if (attendee.properties.voteWeight) {
				acc += attendee.properties.voteWeight ? Number(attendee.properties.voteWeight) : 1;
			}
			return acc;
		}, 0);
		setTotalAttendees(totalAttendees);
		setAttendeesChecked(attendeesChecked);
		setTotalAttendeesWeight(totalAttendeesWeight);
	};

	const getActivities = async () => {
		try {
			setLoading(true);
			const activities = await services.getActivities(eventId);
			setActivities(activities);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const listenQuorum = async (
		activityId: Activity['_id'],
		setAttendeesState: React.Dispatch<
			React.SetStateAction<{
				online: number;
				visited: number;
				weight: number;
			}>
		>
		// setAttendeesOnline: React.Dispatch<React.SetStateAction<number>>,
		// setAttendeesVisited: React.Dispatch<React.SetStateAction<number>>,
		// setAttendeesOnlineWeight: React.Dispatch<React.SetStateAction<number>>
	) => {
		services.listenQuorumByActivity(eventId, activityId, setAttendeesState);
	};

	const listenAnswersQuestion = (
		surveyId: string,
		questionId: string,
		setGraphicsData: React.Dispatch<React.SetStateAction<GraphicsData>>,
		setResponses?: React.Dispatch<React.SetStateAction<VoteResponse[]>>
	) => {
		return services.listenAnswersQuestion(surveyId, questionId, eventId, setGraphicsData, setResponses);
	};

	const getAdditionalDataBySurvey = async (surveyId: string) => {
		try {
			const { questions, graphicType } = await services.getAdditionalDataBySurvey(eventId, surveyId);
			return { questions, graphicType };
		} catch (error) {
			console.log(error);
			return { questions: [], graphicType: 'pie' } as { questions: Question[]; graphicType: GraphicTypeResponse };
		}
	};

	return (
		<AssemblyInCMSContext.Provider
			value={{
				activities,
				attendeesChecked,
				isAssemblyMood,
				totalAttendees,
				surveys,
				listenQuorum,
				totalAttendeesWeight,
				loading,
				updateAttendees,
				listenAnswersQuestion,
				getAdditionalDataBySurvey,
				getActivities,
			}}>
			{props.children}
		</AssemblyInCMSContext.Provider>
	);
}
