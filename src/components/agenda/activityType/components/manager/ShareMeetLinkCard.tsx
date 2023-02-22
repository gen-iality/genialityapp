import { Button, Card, Col, Form, List, Modal, Row, Tabs, Grid } from 'antd';
import { useEffect, useState } from 'react';
import { firestore } from '@/helpers/firebase';
import { UseEventContext } from '@/context/eventContext';
import Notifications from './eviusMeet/Notifications';
import Toolbar from './eviusMeet/Toolbar';
import { generalItems } from './eviusMeet/generalItems';

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
		notifications: string[];
		toolbarButtons: string[];
	};
}

const INITIAL_MEET_CONFIG = {
	openMeet: false,
	config: {
		disableInviteFunctions: false,
		enableWelcomePage: false,
		readOnlyName: true,
		disablePolls: false,
		disableReactions: false,
		disableReactionsModeration: false,
		disableProfile: true,
		hideConferenceTimer: false,
		hideConferenceSubject: true,
		screenshotCapture: false,
		notifications: [
			'connection.CONNFAIL',
			'dialog.micNotSendingData',
			'dialog.serviceUnavailable',
			'dialog.sessTerminated',
			'dialog.sessionRestarted',
			'dialOut.statusMessage',
			'notify.chatMessages',
			'notify.disconnected',
			'notify.connectedOneMember',
			'notify.connectedTwoMembers',
			'notify.leftOneMember',
			'notify.leftTwoMembers',
			'notify.connectedThreePlusMembers',
			'notify.leftThreePlusMembers',
			'notify.grantedTo',
			'notify.hostAskedUnmute',
			'notify.invitedOneMember',
			'notify.invitedThreePlusMembers',
			'notify.invitedTwoMembers',
			'notify.mutedRemotelyTitle',
			'notify.mutedTitle',
			'notify.newDeviceAudioTitle',
			'notify.newDeviceCameraTitle',
			'notify.raisedHand',
			'notify.startSilentTitle',
			'notify.videoMutedRemotelyTitle',
			'toolbar.noAudioSignalTitle',
			'toolbar.noisyAudioInputTitle',
			'toolbar.talkWhileMutedPopup',
		],
		toolbarButtons: ['hangup', 'microphone', 'camera', 'participants-pane', 'tileview', 'settings', 'fullscreen'],
	},
};

export interface ElementProps {
	meetConfig: MeetConfig;
	setMeetConfig: React.Dispatch<React.SetStateAction<MeetConfig>>;
}

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
												dataSource={generalItems}
												renderItem={option => (
													<List.Item
														style={{ padding: '0px' }}
														key={option.key}
														extra={
															<Form.Item style={{ margin: '10px' }}>
																{option.element({ meetConfig, setMeetConfig })}
															</Form.Item>
														}>
														<List.Item.Meta title={option.label} />
													</List.Item>
												)}
											/>
										</Card>
									</Form>
								</Tabs.TabPane>
								{/* <Tabs.TabPane tab='Notificaciones' key='item-notifications'>
									<Row align='middle' justify='center'>
										<Notifications
											values={meetConfig.config.notifications}
											onChange={list =>
												setMeetConfig(prev => ({ ...prev, config: { ...prev.config, notifications: list } }))
											}
										/>
									</Row>
								</Tabs.TabPane> */}
								<Tabs.TabPane tab='Toolbar' key='item-toolbar'>
									<Row align='middle' justify='center'>
										<Toolbar
											values={meetConfig.config.toolbarButtons}
											onChange={list =>
												setMeetConfig(prev => ({ ...prev, config: { ...prev.config, toolbarButtons: list } }))
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
