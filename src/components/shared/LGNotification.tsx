import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { LG_EVENT_IDS } from '@/Utilities/constants';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

enum State {
	INITIAL = 'INITIAL',
	CLOSED = 'CLOSED',
	REGISTERED = 'REGISTERED',
}

export default function LGNotification() {
	const eventContext = UseEventContext();
	const eventUserContext = UseUserEvent();
	const [state, setState] = useState<State>(State.INITIAL);
	const history = useHistory();

	const eventId = (eventContext.value?._id as string) || null;

	const openNotification = () => {
		notification.open({
			message: '¡YA TE HAS REGISTRADO!',
			description: `Verifica tu correo electrónico, llegará un código QR con el cuál podrás acceder de manera presencial al evento. Recuerda que tener el código QR no asegura el ingreso al lugar del evento, tendremos aforo limitado para esta gran experiencia.`,
			onClick: () => {
				console.log('Notification Clicked!');
			},
			onClose: () => {
				setState(State.CLOSED);
			},
		});
	};

	const isLanding = history.location.pathname === `/landing/${eventId}/evento`;
	const isPreLading = history.location.pathname === `/${eventId}`;
	const isLGEvent = !!eventId ? LG_EVENT_IDS.includes(eventId) : false;
	const isInitial = state === State.INITIAL;
	const isRegistered = !!eventUserContext.value?._id;
	const hasRegistered = state === State.REGISTERED;

	useEffect(() => {
		if ((isLanding || isPreLading) && isLGEvent && isRegistered && (isInitial || hasRegistered)) {
			openNotification();
		}
	}, []);

	useEffect(() => {
		if ((isLanding || isPreLading) && isLGEvent && hasRegistered) {
			openNotification();
		}
	}, [state, eventUserContext]);

	useEffect(() => {
		if (eventUserContext.value?._id && isInitial) {
			setState(State.REGISTERED);
		}
	}, [eventUserContext]);

	return null;
}
