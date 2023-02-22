import { Button, Card, Col, Form, List, Modal, Row, Switch, Tabs, Grid } from 'antd';
import { useEffect, useState } from 'react';
import { firestore } from '@/helpers/firebase';
import { UseEventContext } from '@/context/eventContext';
import Notifications from './eviusMeet/Notifications';
import Toolbar from './eviusMeet/Toolbar';

const { useBreakpoint } = Grid;
export interface MeetConfig {
	openMeet: boolean;
	config: {
		disableInviteFunctions: boolean;
		enableWelcomePage: boolean;
		readOnlyName: boolean;
		disablePolls: boolean;
		disableReactions: boolean;
		disableReactionsModeration: boolean;
		disableProfile: boolean;
		hideConferenceTimer: boolean;
		hideConferenceSubject: boolean;
		screenshotCapture: boolean;
		disabledNotifications: string[];
		toolbarButtons: string[];
	};
}

const INITIAL_MEET_CONFIG = {
	openMeet: false,
	config: {
		disableInviteFunctions: false,
		enableWelcomePage: false,
		readOnlyName: false,
		disablePolls: false,
		disableReactions: false,
		disableReactionsModeration: false,
		disableProfile: false,
		hideConferenceTimer: false,
		hideConferenceSubject: false,
		screenshotCapture: false,
		disabledNotifications: ['notify.chatMessages', 'notify.disconnected'],
		toolbarButtons: ['hangup', 'microphone', 'camera', 'participants-pane', 'tileview', 'settings', 'fullscreen'],
	},
};

interface ElementProps {
	meetConfig: MeetConfig;
	setMeetConfig: React.Dispatch<React.SetStateAction<MeetConfig>>;
}

const CONFIG_OPTIONS = [
	{
		key: 'disableInviteFunctions',
		label: 'Desactivar opción de invitar',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableInviteFunctions}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disableInviteFunctions: checked } }))
				}
			/>
		),
		value: 'config.disableInviteFunctions',
	},
	{
		key: 'enableWelcomePage',
		label: 'enableWelcomePage', // este debe ser false en todo momento para los participamntes dentro de evius
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.enableWelcomePage}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, enableWelcomePage: checked } }))
				}
			/>
		),
		value: 'config.enableWelcomePage',
	},
	{
		key: 'readOnlyName',
		label: 'readOnlyName', // este debe ser true en todo momento para los participamntes dentro de evius 
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.readOnlyName}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, readOnlyName: checked } }))
				}
			/>
		),
		value: 'config.readOnlyName',
	},
	{
		key: 'disablePolls',
		label: 'Desactivar encuestas',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disablePolls}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disablePolls: checked } }))
				}
			/>
		),
		value: 'config.disablePolls',
	},
	{
		key: 'disableReactions',
		label: 'Deshabilitar reacciones',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactions}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disableReactions: checked } }))
				}
			/>
		),
		value: 'config.disableReactions',
	},
	{
		key: 'disableReactionsModeration',
		label: 'Reacciones siempre silenciadas',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactionsModeration}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disableReactionsModeration: checked } }))
				}
			/>
		),
		value: 'config.disableReactionsModeration',
	},
	{
		key: 'disableProfile',
		label: 'disableProfile', // este debe ser true en todo momento para los participamntes dentro de evius
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableProfile}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disableProfile: checked } }))
				}
			/>
		),
		value: 'config.disableProfile',
	},
	{
		key: 'hideConferenceTimer',
		label: 'Ocultar el temporizador de conferencia',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.hideConferenceTimer}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, hideConferenceTimer: checked } }))
				}
			/>
		),
		value: 'config.hideConferenceTimer',
	},
	{
		key: 'hideConferenceSubject',
		label: 'hideConferenceSubject', // este debe ser true en todo momento para los participamntes dentro de evius
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.hideConferenceSubject}
				onChange={(checked) =>
					props.setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, hideConferenceSubject: checked } }))
				}
			/>
		),
		value: 'config.hideConferenceSubject',
	},
];

export interface ShareMeetLinkCardProps {
	activityId: string;
}

export default function CardShareLinkEviusMeet(props: ShareMeetLinkCardProps) {
	const eventContext = UseEventContext();
	const activityId = props.activityId;
	const eventId = eventContext?.idEvent;
	const [meetConfig, setMeetConfig] = useState<MeetConfig>(INITIAL_MEET_CONFIG);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const screens = useBreakpoint();

	useEffect(() => {
		const unsubscribe = firestore
			.collection('events')
			.doc(eventId)
			.collection('activities')
			.doc(activityId)
			.onSnapshot((snapshot) => {
				const data = snapshot.data();
				if (data && Object.keys(data).includes('meetConfig')) {
					setMeetConfig(data.meetConfig);
				}
			});
		return () => unsubscribe();
	}, []);

	const updateMeeting = async (eventId: string, activityId: string, status: boolean) => {
		try {
			// console.log(`events/${eventId}/activities/${activityId}`);
			setLoading(true);
			await firestore
				.collection('events')
				.doc(eventId)
				.collection('activities')
				.doc(activityId)
				.update({ meetConfig: { ...meetConfig, openMeet: status } });
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = () => setOpen(true);

	const handleCloseModal = () => setOpen(false);

	const handleOpenMeeting = async () => {
		await updateMeeting(eventId, activityId, true);
		handleCloseModal();
	};

	const handleCloseMeeting = async () => {
		await updateMeeting(eventId, activityId, false);
	};

	if (!meetConfig) return null;

	return (
		<>
			<Card>
				{!meetConfig.openMeet && (
					<Button color='' onClick={handleOpenModal}>
						Iniciar reunión
					</Button>
				)}
				{!!meetConfig.openMeet && (
					<Button color='' onClick={handleCloseMeeting} loading={loading}>
						Finalizar reunión
					</Button>
				)}
				<Modal
					width={700}
					visible={open}
					onCancel={handleCloseModal}
					onOk={handleOpenMeeting}
					confirmLoading={loading}
					bodyStyle={{ height: '70vh' }}
					okText='Iniciar'>
					<Row>
						<Col xs={24}>
							<Tabs>
								<Tabs.TabPane
									className={!screens.xs ? 'desplazar' : ''}
									style={{ height: '60vh', overflowY: 'auto' }}
									tab='General'
									key='item-general'>
									<Form layout='vertical'>
									<Card bordered={false}>
									<List
											size='small'
											dataSource={CONFIG_OPTIONS}
											renderItem={(option) => (
												<List.Item
												style={{padding:'0px'}}
													key={option.key}
													extra={<Form.Item style={{margin:'10px'}} >{option.element({ meetConfig, setMeetConfig })}</Form.Item>}>
													<List.Item.Meta title={option.label} />
												</List.Item>
											)}
										/>
									</Card>
									</Form>
								</Tabs.TabPane>
								<Tabs.TabPane tab='Notificaciones' key='item-notifications'>
									<Row align='middle' justify='center'>
										<Notifications onChange={(list) =>
												setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, disabledNotifications: list } }))
											} />
									</Row>
								</Tabs.TabPane>
								<Tabs.TabPane tab='Toolbar' key='item-toolbar'>
									<Row align='middle' justify='center'>
										<Toolbar
											onChange={(list) =>
												setMeetConfig((prev) => ({ ...prev, config: { ...prev.config, toolbarButtons: list } }))
											}
										/>
									</Row>
								</Tabs.TabPane>
							</Tabs>
						</Col>
					</Row>
				</Modal>
			</Card>
		</>
	);
}
