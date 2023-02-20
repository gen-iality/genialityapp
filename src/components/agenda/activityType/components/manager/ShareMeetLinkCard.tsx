import { Button, Card, Col, Form, Modal, Row, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { firestore } from '@/helpers/firebase';
import { UseEventContext } from '@/context/eventContext';
import Notifications from './eviusMeet/Notifications';
import Toolbar from './eviusMeet/Toolbar';

interface MeetConfig {
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
	const [open, setOpen] = useState(false);

	const getMeetConfig = async (eventId: string, activityId: string) => {
		try {
			const activitySnapshot = await firestore
				.collection('events')
				.doc(eventId)
				.collection('activities')
				.doc(activityId)
				.get();
			const data = activitySnapshot.data();
			console.log({ data });
			if (data && Object.keys(data).includes('meetConfig')) {
				console.log({ meetConfigInFb: data.meetConfig });
			}
		} catch (error) {
		} finally {
		}
	};

	const updateMeeting = async (eventId: string, activityId: string) => {
		try {
			await firestore
				.collection('events')
				.doc(eventId)
				.collection('activities')
				.doc(activityId)
				.set({ meetConfig }, { merge: true });
		} catch (error) {
		} finally {
			getMeetConfig(eventId, activityId);
		}
	};

	useEffect(() => {
		console.log({ meetConfig });
	}, [meetConfig]);

	useEffect(() => {
		if (!!eventId && !!activityId) {
			getMeetConfig(eventId, activityId);
		}
	}, [eventId, activityId]);

	const handleOpenMeeting = () => {
		console.log({ meetConfig });
	};

	if (!meetConfig) return null;

	return (
		<>
			<Card>
				<Button color='' onClick={() => setOpen(true)}>
					Iniciar reunión
				</Button>
				<Modal
					visible={open}
					onCancel={() => setOpen(false)}
					onOk={handleOpenMeeting}
					okText='Iniciar'
					title='Abrir reunion para asistentes'>
					<Row>
						<Col xs={24}>
							<Card title='Opciones de reunión'>
								<Form>
									<Row>
										{CONFIG_OPTIONS.map(option => (
											<Col key={option.key} xs={12}>
												<Form.Item label={option.label}>{option.element({ meetConfig, setMeetConfig })}</Form.Item>
											</Col>
										))}
									</Row>
								</Form>
							</Card>
						</Col>
					</Row>
				</Modal>
			</Card>
			{/* <Card title='Opciones de reunión'>
				<Form>
					{CONFIG_OPTIONS.map(option => (
						<Form.Item key={option.key} label={option.label}>
							{option.element({ meetConfig, setMeetConfig })}
						</Form.Item>
					))}
				</Form>
			</Card>
			<Toolbar
				values={meetConfig.config.toolbarButtons}
				onChange={list => setMeetConfig(prev => ({ ...prev, config: { ...prev.config, toolbarButtons: [...list] } }))}
			/>
			<Notifications
				values={meetConfig.config.disabledNotifications}
				onChange={list =>
					setMeetConfig(prev => ({ ...prev, config: { ...prev.config, disabledNotifications: [...list] } }))
				}
			/> */}
		</>
	);
}
