import PrintBingoCartonButton from '@/components/games/bingo/components/PrintBingoCartonButton';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { firestore } from '@/helpers/firebase';
import { Alert, Button, Space, Grid, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  EventAccessActionButtonsInterface,
  EventAccessActionInterface,
  informativeMessagesInterface,
} from '../interfaces/interfaces';
import { assignStatusAccordingToAction } from './utils/utils';
import { useIntl } from 'react-intl';
import ConditionalModal from '@/components/authentication/ConditionalModal';
import { useEventCapacityValidator } from '@/events-capacity';
import { useModalLogic } from '@/hooks/useModalLogic';
import { CapacityCompleted } from '@/events-capacity/components/CapacityCompleted';

const { useBreakpoint } = Grid;

const EventAccessAction = ({ eventAction }: EventAccessActionInterface) => {
  let cEvent = UseEventContext();
  const history = useHistory();
  const intl = useIntl();
  const initialButtonsState = [{ label: 'INITIAL_STATE', action: () => {} }];
  const informativeMessagesState = [{ label: 'INITIAL_STATE' }];
  const bgColor = cEvent?.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent?.value?.styles?.textMenu;
  const [eventData, setEventData] = useState<any>({});
  const screens = useBreakpoint();
  const [modal, setModal] = useState(false);
  const [isAforoCompleted, setIsAforoCompleted] = useState(false);
  const { isCompletedAforo } = useEventCapacityValidator();
  const idEvent = cEvent?.value?._id;
  const [buttonsActions, setButtonsActions] = useState<EventAccessActionButtonsInterface[]>(initialButtonsState);
  const [informativeMessages, setInformativeMessage] = useState<informativeMessagesInterface[]>(
    informativeMessagesState
  );
  console.log('buttonsActions', buttonsActions);
  let { handleChangeTypeModal, helperDispatch } = useHelper();
  const { closeModal, isOpenModal, openModal } = useModalLogic();
  const ORIGINAL_EVENT_ID: { [key: string]: string } = {
    '64f2159bf5076637df054592': '64cacb2d6014cebb340ef142', // demo wom
    /* '64230dc18611006a490d6022' : '645536848fb7b0e0dd0eb262' */ //evento de pruebas para aleja
  };

  const handleFunction = (params: EventAccessActionButtonsInterface[]): EventAccessActionButtonsInterface[] => {
    const fakeEvents = Object.keys(ORIGINAL_EVENT_ID);
    if (fakeEvents.includes(cEvent.value._id)) {
      return [
        {
          label: 'Ingresar al evento',
          action: () => {
            setModal(true);
          },
        },
      ];
    } else {
      return buttonsActions;
    }
  };
  const onRegisterUser = async (action: () => void) => {
    const isCompleted = await isCompletedAforo(cEvent.value._id);
    setIsAforoCompleted(isCompleted);
    if (isCompleted)
      return Modal.warning({
        title: 'Capacidad insuficiente',
        content: `El evento ha llegado al máximo de participantes disponibles, si cree que es un error, comuníquese con el administrador del evento`,
      });
    action();
  };

  useEffect(() => {
    if (idEvent && !Object.keys(eventData).length) {
      const unsubscribe = firestore
        .collection('events')
        .doc(idEvent)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (!!data && Object.keys(data).includes('_id')) {
            setEventData(data);
          } else {
            setEventData(cEvent.value);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  /*  useEffect(() => {
    console.log({ eventData, cEvent });
  }, [eventData, cEvent]); */

  useEffect(() => {
    const assignStatusAccordingToActionParams = {
      setButtonsActions,
      setInformativeMessage,
      initialButtonsState,
      informativeMessagesState,
      eventAction,
      handleChangeTypeModal,
      helperDispatch,
      cEvent: eventData || cEvent,
      history,
      intl,
    };

    assignStatusAccordingToAction(assignStatusAccordingToActionParams);

    return () => {
      setInformativeMessage(informativeMessagesState);
      setButtonsActions(initialButtonsState);
    };
  }, [eventAction, eventData]);

  useEffect(() => {
    const fetchAforoCompleted = async () => {
      const isCompleted = await isCompletedAforo(cEvent.value._id);
      const isRegisterAction = buttonsActions.find((button) => button.label === 'Inscribirme al evento');
      console.log('isRegisterAction', isRegisterAction);
      if (isCompleted && isRegisterAction) openModal();
      setIsAforoCompleted(isCompleted);
    };
    fetchAforoCompleted();
  }, [buttonsActions]);

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {handleFunction(buttonsActions).map((button, index) => (
        <>
          {button.label !== 'INITIAL_STATE' && (
            <Button
              disabled={button.label === 'Inscribirme al evento' && isAforoCompleted}
              key={`${index}-${button.label}`}
              block
              className={
                button.label === 'Ingresar al evento'
                  ? 'animate__animated animate__heartBeat animate__slower animate__repeat-3'
                  : ''
              }
              style={{
                height: '48px',
                padding: '6.4px 30px',
                color: idEvent !== '6334782dc19fe2710a0b8753' ? bgColor : '#c55a95',
                backgroundColor: textColor,
                border: 'none',
                width: screens.xs ? '300px' : '',
              }}
              type='primary'
              size='large'
              onClick={button.label === 'Inscribirme al evento' ? () => onRegisterUser(button.action) : button.action}>
              {isAforoCompleted && button.label === 'Inscribirme al evento' ? 'Capacidad Superada' : button.label}
            </Button>
          )}
        </>
      ))}
      <ConditionalModal
        visible={modal}
        setVisible={setModal}
        realEvent={ORIGINAL_EVENT_ID[cEvent.value._id] ?? ''}
        key={'conditional-key'}
        bgColor={bgColor}
        textColor={textColor}
      />

      {isOpenModal && <CapacityCompleted visible={isOpenModal} onCancel={closeModal} />}
      {informativeMessages.map((message) => (
        <>{message.label !== 'INITIAL_STATE' && <Alert message={message.label} type='success' />}</>
      ))}
    </Space>
  );
};

export default EventAccessAction;
