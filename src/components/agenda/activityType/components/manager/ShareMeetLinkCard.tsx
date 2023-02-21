import { Button, Card, Col, Form, Modal, Row, Switch, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { firestore } from '@/helpers/firebase';
import { UseEventContext } from '@/context/eventContext';
import Notifications from './eviusMeet/Notifications';
import Toolbar from './eviusMeet/Toolbar';

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
		label: 'disableInviteFunctions',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableInviteFunctions}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableInviteFunctions: checked } }))
				}
			/>
		),
		value: 'config.disableInviteFunctions',
	},
	{
		key: 'enableWelcomePage',
		label: 'enableWelcomePage',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.enableWelcomePage}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, enableWelcomePage: checked } }))
				}
			/>
		),
		value: 'config.enableWelcomePage',
	},
	{
		key: 'readOnlyName',
		label: 'readOnlyName',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.readOnlyName}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, readOnlyName: checked } }))
				}
			/>
		),
		value: 'config.readOnlyName',
	},
	{
		key: 'disablePolls',
		label: 'disablePolls',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disablePolls}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disablePolls: checked } }))
				}
			/>
		),
		value: 'config.disablePolls',
	},
	{
		key: 'disableReactions',
		label: 'disableReactions',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactions}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableReactions: checked } }))
				}
			/>
		),
		value: 'config.disableReactions',
	},
	{
		key: 'disableReactionsModeration',
		label: 'disableReactionsModeration',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableReactionsModeration}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableReactionsModeration: checked } }))
				}
			/>
		),
		value: 'config.disableReactionsModeration',
	},
	{
		key: 'disableProfile',
		label: 'disableProfile',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.disableProfile}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disableProfile: checked } }))
				}
			/>
		),
		value: 'config.disableProfile',
	},
	{
		key: 'hideConferenceTimer',
		label: 'hideConferenceTimer',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.hideConferenceTimer}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, hideConferenceTimer: checked } }))
				}
			/>
		),
		value: 'config.hideConferenceTimer',
	},
	{
		key: 'hideConferenceSubject',
		label: 'hideConferenceSubject',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.hideConferenceSubject}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, hideConferenceSubject: checked } }))
				}
			/>
		),
		value: 'config.hideConferenceSubject',
	},
	{
		key: 'screenshotCapture',
		label: 'screenshotCapture',
		element: (props: ElementProps) => (
			<Switch
				checked={props.meetConfig.config.screenshotCapture}
				onChange={checked =>
					props.setMeetConfig(prev => ({ ...prev, config: { ...prev.config, screenshotCapture: checked } }))
				}
			/>
		),
		value: 'config.screenshotCapture',
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

	useEffect(() => {
		const unsubscribe = firestore
			.collection('events')
			.doc(eventId)
			.collection('activities')
			.doc(activityId)
			.onSnapshot(snapshot => {
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
					visible={open}
					onCancel={handleCloseModal}
					onOk={handleOpenMeeting}
					confirmLoading={loading}
					okText='Iniciar'
					title='Abrir reunion para asistentes'>
					<Row>
						<Col xs={24}>
							<Card title='Opciones de reunión'>
								<Row>
									<Tabs>
										<Tabs.TabPane tab='General' key='item-general'>
											<Form>
												{CONFIG_OPTIONS.map(option => (
													<Col key={option.key} xs={12}>
														<Form.Item label={option.label}>{option.element({ meetConfig, setMeetConfig })}</Form.Item>
													</Col>
												))}
											</Form>
										</Tabs.TabPane>
										<Tabs.TabPane tab='Notificaciones' key='item-notifications'>
											<Notifications />
										</Tabs.TabPane>
										<Tabs.TabPane tab='Toolbar' key='item-toolbar'>
											<Toolbar />
										</Tabs.TabPane>
									</Tabs>
								</Row>
							</Card>
						</Col>
					</Row>
				</Modal>
			</Card>
		</>
	);
}
