import { Modal } from 'antd';
import {
	EventAccessActionButtonsInterface,
	informativeMessagesInterface,
	internalOrExternalEventInterface,
} from '../../interfaces/interfaces';
import { useIntl } from 'react-intl';

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
	const organizationId = cEvent?.organizer_id
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
	
	// const isArkMedEvent = !!eventId ? ['6414c5bfecd0614a5c087352'].includes(eventId) : false;

	const isArkMedEvent = !!organizationId ? ['6435b160705b239e5506c727','6414c574211337f07601ae13'].includes(organizationId) : false;


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
	intl
}: any) => {
	let buttonsAction: EventAccessActionButtonsInterface[] = initialButtonsState;
	let informativeMessage: informativeMessagesInterface[] = informativeMessagesState;

	const signup_event = intl.formatMessage({id: 'signup_event', defaultMessage: 'Inscribirme al evento'});
	const signup = intl.formatMessage({id: 'signup', defaultMessage: '¡INSCRÍBETE!'});
	const enter_event = intl.formatMessage({id: 'enter_event', defaultMessage: 'Ingresar al evento'});
	const log_in = intl.formatMessage({id: 'log_in', defaultMessage: 'Iniciar sesión'});
	const already_registered_event = intl.formatMessage({id: 'already_registered_event', defaultMessage: 'Ya estás inscrito en el evento'});
	const private_event = intl.formatMessage({id: 'private_event', defaultMessage: 'Evento privado'});
	const not_invited = intl.formatMessage({id: 'not_invited', defaultMessage: 'No estas invitado'});
	const has_been_invited_event = intl.formatMessage({id: 'has_been_invited_event', defaultMessage: 'Has sido invitado a este evento'});
	const INITIAL_STATE = intl.formatMessage({id: 'INITIAL_STATE', defaultMessage: 'INITIAL_STATE'})
	const buy = intl.formatMessage({id: 'buy', defaultMessage: 'Comprar'})
	//Validacion temporal para el evento audi
	const idEvent = cEvent?._id;
	const labelAudi: string = idEvent !== '6334782dc19fe2710a0b8753' ? signup_event : signup;
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
			buttonsAction = [{ label: enter_event, action: () => internalOrExternalEvent({ cEvent, history }) }];
			setButtonsActions(buttonsAction);
			break;

		case 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT':
			buttonsAction = [
				{ label: signup_event, action: () => helperDispatch({ type: 'showRegister', visible: true }) },
				{ label: log_in, action: () => helperDispatch({ type: 'showLogin', visible: true }) },
			];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => helperDispatch({ type: 'showRegister', visible: true }) },)

			setButtonsActions(buttonsAction);
			break;
		case 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT_PAYMENT':
			buttonsAction = [{ label: buy, action: () => {
				if(cEvent.payment?.externalPayment){
					window.open(cEvent.payment?.urlExternalPayment,'_blank')
					return
				}
				helperDispatch({ type: 'showLogin', visible: true })
			} }];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => handleChangeTypeModal('registerForTheEvent') })
	
			setButtonsActions(buttonsAction);
			break;
		case 'ACTION_REGISTER_FOR_THE_EVENT':
			buttonsAction = [{ label: signup_event, action: () => handleChangeTypeModal('registerForTheEvent') }];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => handleChangeTypeModal('registerForTheEvent') })

			setButtonsActions(buttonsAction);
			break;
		case 'ACTION_REGISTER_FOR_THE_EVENT_PAYMENT':
			buttonsAction = [{ label: buy, action: () => {
				if(cEvent.payment?.externalPayment){
					window.open(cEvent.payment?.urlExternalPayment,'_blank')
					return
				}
				handleChangeTypeModal('registerForTheEventPayment')
			} }];
			// if (bingoExists) buttonsAction.push({ label: 'Imprimir cartón', action: () => handleChangeTypeModal('registerForTheEvent') })
	
			setButtonsActions(buttonsAction);
			break;
		case 'MESSAGE_YOU_ARE_ALREADY_REGISTERED':
			informativeMessage = [{ label: already_registered_event }];
			setInformativeMessage(informativeMessage);
			break;

		case 'ACTION_LOGIN_AND_PRIVATE_EVENT_MESSAGE':
			buttonsAction = [
				{
					label: log_in,
					action: () => helperDispatch({ type: 'showLogin', visible: true }),
				},
			];
			informativeMessage = [{ label: private_event }];

			setButtonsActions(buttonsAction);
			setInformativeMessage(informativeMessage);
			break;

		case 'PRIVATE_EVENT_MESSAGE_AND_MESSAGE_YOU_ARE_NOT_INVITED':
			informativeMessage = [{ label: not_invited }, { label: private_event }];

			setInformativeMessage(informativeMessage);
			break;

		case 'MESSAGE_YOU_ARE_INVITED':
			informativeMessage = [{ label: has_been_invited_event }];

			setInformativeMessage(informativeMessage);
			break;

		case 'NO_ACTION':
			informativeMessage = [{ label: INITIAL_STATE }];

			setInformativeMessage(informativeMessage);
			break;

		default:
			setInformativeMessage(informativeMessage);
			setButtonsActions(buttonsAction);
			break;
	}
};
