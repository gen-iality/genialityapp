import { UseEventContext } from '@/context/eventContext';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { Alert, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
	EventAccessActionButtonsInterface,
	EventAccessActionInterface,
	informativeMessagesInterface,
} from '../interfaces/interfaces';
import { assignStatusAccordingToAction } from './utils/utils';

const EventAccessAction = ({ eventAction }: EventAccessActionInterface) => {
	let cEvent = UseEventContext();
	const history = useHistory();
	const initialButtonsState = [{ label: 'INITIAL_STATE', action: () => {} }];
	const informativeMessagesState = [{ label: 'INITIAL_STATE' }];
	const bgColor = cEvent?.value?.styles?.toolbarDefaultBg;
	const textColor = cEvent?.value?.styles?.textMenu;

	//Validacion temporal para el evento audi
	const idEvent = cEvent?.value?._id;

	const [buttonsActions, setButtonsActions] = useState<EventAccessActionButtonsInterface[]>(initialButtonsState);

	const [informativeMessages, setInformativeMessage] = useState<informativeMessagesInterface[]>(
		informativeMessagesState
	);

	let { handleChangeTypeModal, helperDispatch } = useHelper();

	useEffect(() => {
		const assignStatusAccordingToActionParams = {
			setButtonsActions,
			setInformativeMessage,
			initialButtonsState,
			informativeMessagesState,
			eventAction,
			handleChangeTypeModal,
			helperDispatch,
			cEvent: cEvent.value,
			history,
		};

		// console.log('setButtonsActions', setButtonsActions);
		// console.log('setInformativeMessage', setInformativeMessage);
		// console.log('initialButtonsState', initialButtonsState);
		// console.log('informativeMessagesState', informativeMessagesState);
		// console.log('eventAction', eventAction);
		// console.log('handleChangeTypeModal', handleChangeTypeModal);
		// console.log('helperDispatch', helperDispatch);
		// console.log('cEvent: cEvent.value', cEvent);
		// console.log('history', history);

		assignStatusAccordingToAction(assignStatusAccordingToActionParams);

		return () => {
			setInformativeMessage(informativeMessagesState);
			setButtonsActions(initialButtonsState);
		};
	}, [eventAction]);

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{buttonsActions.map(button => (
				<>
					{button.label !== 'INITIAL_STATE' && (
						<Button
							block
							style={{
								color: idEvent !== '6334782dc19fe2710a0b8753' ? bgColor : '#c55a95',
								backgroundColor: textColor,
								border: 'none',
							}}
							type='primary'
							size='large'
							onClick={button.action}>
							{button.label}
						</Button>
					)}
				</>
			))}

			{informativeMessages.map(message => (
				<>{message.label !== 'INITIAL_STATE' && <Alert message={message.label} type='success' />}</>
			))}
		</Space>
	);
};

export default EventAccessAction;
