import { UseEventContext } from '@/context/eventContext';
import { UseSurveysContext } from '@/context/surveysContext';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { EventContext, Survey } from '../types';
import * as services from '../services';

const assemblyInitialValue = {};

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	// State
	const [surveys, setSurveys] = useState<Survey[]>([]);
	// Hooks
	const eventContext = UseEventContext() as EventContext;
	console.log('AssemblyInCMSContext:eventContext', eventContext);
	// Constants
	const eventId = eventContext.idEvent;
	const isAssemblyMood = useMemo(
		() => eventContext.value.user_properties.some(userProperty => userProperty.type === 'voteWeight'),
		[eventContext.status]
	);

	// const surveysContext = UseSurveysContext();
	// console.log('AssemblyInCMSContext:surveysContext', surveysContext);
	useEffect(() => {
		getAllSurveys();
	}, []);

	const getAllSurveys = async () => {
		try {
			const { data } = await services.getAllSurveys(eventId);
			setSurveys(data);
		} catch (error) {
			console.error(error);
		}
	};

	return <AssemblyInCMSContext.Provider value={{}}>{props.children}</AssemblyInCMSContext.Provider>;
}
