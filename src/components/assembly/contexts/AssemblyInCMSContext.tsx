import { UseEventContext } from '@/context/eventContext';
import { UseSurveysContext } from '@/context/surveysContext';
import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { EventContext } from '../types';
import * as services from '../services';

const assemblyInitialValue = {};

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	const eventContext = UseEventContext() as EventContext;
	console.log('AssemblyInCMSContext:eventContext', eventContext);

	const eventId = eventContext.idEvent;

	const isAssemblyMood = useMemo(
		() => eventContext.value.user_properties.some(userProperty => userProperty.type === 'voteWeight'),
		[eventContext.status]
	);
	console.log('AssemblyInCMSContext:isAssemblyMood', isAssemblyMood);

	// const surveysContext = UseSurveysContext();
	// console.log('AssemblyInCMSContext:surveysContext', surveysContext);
	useEffect(() => {
		getAllSurveys();
	}, []);

	const getAllSurveys = async () => {
		try {
			const surveys = await services.getAllSurveys(eventId);
		} catch (error) {
			console.error(error);
		}
	};

	return <AssemblyInCMSContext.Provider value={{}}>{props.children}</AssemblyInCMSContext.Provider>;
}
