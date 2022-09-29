import { Modal } from 'antd';
import {
  EventAccessActionButtonsInterface,
  informativeMessagesInterface,
  internalOrExternalEventInterface,
} from '../../interfaces/interfaces';

const internalOrExternalEvent = ({ cEvent, history }: internalOrExternalEventInterface) => {
  const { confirm } = Modal;

  if (cEvent?.where_it_run === 'InternalEvent') {
    //The user's session is saved for the current event
    window.sessionStorage.setItem('session', cEvent?._id);

    history.replace(`/landing/${cEvent?._id}`);
    return;
  }

  confirm({
    title: 'Estás abandonando Evius',
    content: 'Esto es debido a que el evento se llevara a cabo en otro sitio web',
    onOk() {
      window.open(cEvent?.url_external, '_blank');
    },
    onCancel() {},
  });
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

  switch (eventAction) {
    case 'ACTION_ONLY_EVENT_REGISTRATION':
      buttonsAction = [
        { label: 'Inscribirme al evento', action: () => helperDispatch({ type: 'showLogin', visible: true }) },
      ];

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
      buttonsAction = [{ label: 'Ingresar al evento', action: () => internalOrExternalEvent({ cEvent, history }) }];
      setButtonsActions(buttonsAction);
      break;

    case 'ACTION_LOG_IN_OR_REGISTER_FOR_THE_EVENT':
      buttonsAction = [
        { label: 'Iniciar sesión', action: () => helperDispatch({ type: 'showLogin', visible: true }) },
        { label: 'Inscribirme al evento', action: () => helperDispatch({ type: 'showRegister', visible: true }) },
      ];

      setButtonsActions(buttonsAction);
      break;

    case 'ACTION_REGISTER_FOR_THE_EVENT':
      buttonsAction = [{ label: 'Inscribirme al evento', action: () => handleChangeTypeModal('registerForTheEvent') }];

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
