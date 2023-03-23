import { Modal } from 'antd';
import {
	EventAccessActionButtonsInterface,
	informativeMessagesInterface,
	internalOrExternalEventInterface,
} from '../../interfaces/interfaces';

type Status = 'withURL' | 'noURL';

type CopyStatus = Record<Status, Copy>;

interface Copy {
	title: string;
	titleArkMed: string;
	content: string;
	contentArkMed: string;
}

const EXTERNAL_REDIRECT_COPYS: CopyStatus = {
	withURL: {
		title: 'Estás abandonando Evius',
		titleArkMed: 'Bienvenido',
		content: 'Esto es debido a que el evento se llevara a cabo en otro sitio web',
		contentArkMed: 'A continuación ingresará al evento Insulinización eficaz, conveniente y segura desde el inicio.',
	},
	noURL: {
		title: 'El evento aún no ha comenzado',
		titleArkMed: '',
		content: 'Asegúrate de estar atento a las actualizaciones y no te pierdas ningún detalle.',
		contentArkMed: '',
	},
};

const internalOrExternalEvent = ({ cEvent, history }: internalOrExternalEventInterface) => {
	const { confirm } = Modal;
	const eventId = cEvent?._id;

	if (cEvent?.where_it_run === 'InternalEvent') {
		//The user's session is saved for the current event
		window.sessionStorage.setItem('session', cEvent?._id);

		if (!!cEvent?.redirect_activity && typeof cEvent?.redirect_activity === 'string') {
			history.replace(`/landing/${cEvent?._id}/activity/${cEvent?.redirect_activity}`);
		} else {
			history.replace(`/landing/${cEvent?._id}`);
		}
		return;
	}

	const withURL: Status = !!cEvent?.url_external ? 'withURL' : 'noURL';

	const isArkMedEvent = !!eventId ? ['6414c5bfecd0614a5c087352'].includes(eventId) : false;

	if (isArkMedEvent) {
		window.open(cEvent?.url_external, '_blank');
		return;
	} else {
		confirm({
			title: isArkMedEvent ? EXTERNAL_REDIRECT_COPYS[withURL].titleArkMed : EXTERNAL_REDIRECT_COPYS[withURL].title,
			content: isArkMedEvent ? EXTERNAL_REDIRECT_COPYS[withURL].contentArkMed : EXTERNAL_REDIRECT_COPYS[withURL].content,
			onOk() {
				if (cEvent?.url_external && cEvent.where_it_run === 'ExternalEvent') {
					window.open(cEvent?.url_external, '_blank');
				} else {
					return;
				}
			},
			onCancel() {},
		});
	}

};

export const assignStatusAccordingToAction = ({
	setButtonsActions,
	setInformativeMessage,
	initialButtonsState,
	informativeMessagesState,
	eventAction,
	handleChangeTypeModal,
	helperDispatch,
	cEvent,
	history,
}: any) => {
	let buttonsAction: EventAccessActionButtonsInterface[] = initialButtonsState;
	let informativeMessage: informativeMessagesInterface[] = informativeMessagesState;

	//Validacion temporal para el evento audi
	const idEvent = cEvent?._id;
	const labelAudi: string = idEvent !== '6334782dc19fe2710a0b8753' ? 'Inscribirme al evento' : 'INSCRÍBETE';
	const bingoExists = !!cEvent?.bingo || !!cEvent?.dynamics?.bingo;

	switch (eventAction) {
		case 'ACTION_ONLY_EVENT_REGISTRATION':
			buttonsAction = [{ label: labelAudi, action: () => helperDispatch({ type: 'showLogin', visible: true }) }];

			setButtonsActions(buttonsAction);
			break;

		case 'ACTION_REGISTER_FOR_THE_EVENT_ANONYMOUS':
			buttonsAction = [
				{
					label: labelAudi,
					action: () => helperDispatch({ type: 'showLogin', visible: true }),
				},
			];

			setButtonsActions(buttonsAction);
			break;

		case 'ACTION_ENTER_THE_EVENT':
			// Here goes the logic for button 'Ingresar al evento'
			buttonsAction = [{ label: 'Ingresar al evento', action: () => internalOrExternalEvent({ cEvent, history }) }];
			setButtonsActions(buttonsAction);
			break;

		case 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT':
			buttonsAction = [
				{ label: 'Iniciar sesión', action: () => helperDispatch({ type: 'showLogin', visible: true }) },
				{ label: 'Inscribirme al evento', action: () => helperDispatch({ type: 'showRegister', visible: true }) },
			];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => helperDispatch({ type: 'showRegister', visible: true }) },)

			setButtonsActions(buttonsAction);
			break;

		case 'ACTION_REGISTER_FOR_THE_EVENT':
			buttonsAction = [{ label: 'Inscribirme al evento', action: () => handleChangeTypeModal('registerForTheEvent') }];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => handleChangeTypeModal('registerForTheEvent') })

			setButtonsActions(buttonsAction);
			break;

		case 'MESSAGE_YOU_ARE_ALREADY_REGISTERED':
			informativeMessage = [{ label: 'Ya estás inscrito en el evento' }];
			setInformativeMessage(informativeMessage);
			break;

		case 'ACTION_LOGIN_AND_PRIVATE_EVENT_MESSAGE':
			buttonsAction = [
				{
					label: 'Iniciar sesión',
					action: () => helperDispatch({ type: 'showLogin', visible: true }),
				},
			];
			informativeMessage = [{ label: 'Evento privado' }];

			setButtonsActions(buttonsAction);
			setInformativeMessage(informativeMessage);
			break;

		case 'PRIVATE_EVENT_MESSAGE_AND_MESSAGE_YOU_ARE_NOT_INVITED':
			informativeMessage = [{ label: 'No estas invitado' }, { label: 'Evento privado' }];

			setInformativeMessage(informativeMessage);
			break;

		case 'MESSAGE_YOU_ARE_INVITED':
			informativeMessage = [{ label: 'Has sido invitado a este evento' }];

			setInformativeMessage(informativeMessage);
			break;

		case 'NO_ACTION':
			informativeMessage = [{ label: 'INITIAL_STATE' }];

			setInformativeMessage(informativeMessage);
			break;

		default:
			setInformativeMessage(informativeMessage);
			setButtonsActions(buttonsAction);
			break;
	}
};
