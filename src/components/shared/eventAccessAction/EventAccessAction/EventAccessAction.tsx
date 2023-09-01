import PrintBingoCartonButton from '@/components/games/bingo/components/PrintBingoCartonButton';
import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { firestore } from '@/helpers/firebase';
import { Alert, Button, Space, Grid , Modal} from 'antd';
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

const { useBreakpoint } = Grid;

const EventAccessAction = ({ eventAction }: EventAccessActionInterface) => {
	let cEvent = UseEventContext();
	const cUser = UseUserEvent();
	const history = useHistory();
	const intl = useIntl();
	const initialButtonsState = [{ label: 'INITIAL_STATE', action: () => {} }];
	const informativeMessagesState = [{ label: 'INITIAL_STATE' }];
	const bgColor = cEvent?.value?.styles?.toolbarDefaultBg;
	const textColor = cEvent?.value?.styles?.textMenu;
	const [eventData, setEventData] = useState<any>({});
	const screens = useBreakpoint();
	const [modal, setModal] = useState(false)

	//Validacion temporal para el evento audi
	const idEvent = cEvent?.value?._id;

	const [buttonsActions, setButtonsActions] = useState<EventAccessActionButtonsInterface[]>(initialButtonsState);

	const [informativeMessages, setInformativeMessage] = useState<informativeMessagesInterface[]>(
		informativeMessagesState
	);

	let { handleChangeTypeModal, helperDispatch } = useHelper();

	useEffect(() => {
		if (idEvent && !Object.keys(eventData).length) {
			const unsubscribe = firestore
				.collection('events')
				.doc(idEvent)
				.onSnapshot(snapshot => {
					const data = snapshot.data();
					if (!!data && Object.keys(data).includes('_id')) {
						setEventData(data);
					} else {
						setEventData(cEvent.value)
					}
				});
			return () => unsubscribe();
		}
	}, []);

	useEffect(() => {
		console.log({ eventData, cEvent })
	}, [eventData, cEvent])

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
			intl
		};

		assignStatusAccordingToAction(assignStatusAccordingToActionParams);

		return () => {
			setInformativeMessage(informativeMessagesState);
			setButtonsActions(initialButtonsState);
		};
	}, [eventAction, eventData]);
	const EVENTS_WON =['64d68d421e2dfb1800054462'/* , '64230dc18611006a490d6022', '64cacb2d6014cebb340ef142' */]
	const ORIGINAL_EVENT_ID  : { [key : string] : string}= {
		'64d68d421e2dfb1800054462': '64df6d1b37be028c4c064352'
	}
	const handleFunction = (params: EventAccessActionButtonsInterface[]) : EventAccessActionButtonsInterface[] => {
		if (EVENTS_WON.includes(cEvent.value._id)) {
			return [{
				label: 'Ingresar al evento',
				action: () => {
					setModal(true)
				}
				}]
		} else {
			return buttonsActions
		}
	}
	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{handleFunction(buttonsActions).map((button, index) => (
				<>
					{button.label !== 'INITIAL_STATE' && (
						<Button
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
								width: screens.xs ? '300px' : ''
							}}
							type='primary'
							size='large'
							onClick={button.action}>
							{button.label}
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

			{informativeMessages.map(message => (
				<>{message.label !== 'INITIAL_STATE' && <Alert message={message.label} type='success' />}</>
			))}
		</Space>
	);
};

export default EventAccessAction;
