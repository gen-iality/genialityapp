import { Button, Card, Col, Form, List, Modal, Row, Tabs, Grid, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { firestore } from '@/helpers/firebase';
import { UseEventContext } from '@/context/eventContext';
import Toolbar from '../../../agenda/activityType/components/manager/eviusMeet/Toolbar';
import { generalItems } from '../../../agenda/activityType/components/manager/eviusMeet/generalItems';
import { MeetConfig } from '../../interfaces/Index.interfaces';
import { INITIAL_MEET_CONFIG } from '../../utils/utils';

const { useBreakpoint } = Grid;


export interface ElementProps {
	meetConfig: MeetConfig;
	setMeetConfig: React.Dispatch<React.SetStateAction<MeetConfig>>;
}

export interface ShareMeetLinkCardProps {
	activityId: string;
}

export default function ConfigMeet() {
	const eventContext = UseEventContext();
	const activityId = '1';
	const eventId = eventContext?.idEvent;
	const [meetConfig, setMeetConfig] = useState<MeetConfig>(INITIAL_MEET_CONFIG);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const screens = useBreakpoint();

	const updateMeeting = async (eventId: string, activityId: string, status: boolean) => {
/* 		try {
			console.log(`events/${eventId}/activities/${activityId}`);
			const newMeetConfig = status ? { ...meetConfig, openMeet: status } : INITIAL_MEET_CONFIG;

			setLoading(true);
			await firestore
				.collection('events')
				.doc(eventId)
				.collection('activities')
				.doc(activityId)
				.update({ meetConfig: newMeetConfig });
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		} */
	};

	const handleOpenModal = () => setOpen(true);

	const handleCloseModal = () => setOpen(false);

	const handleOpenMeeting = async () => {
/* 		await updateMeeting(eventId, activityId, true);
		handleCloseModal(); */
	};

	const handleCloseMeeting = async () => {
	/* 	await updateMeeting(eventId, activityId, false); */
	};

	return (
		<>
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
												renderItem={(option: any) => (
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
								<Tabs.TabPane
									className={!screens.xs ? 'desplazar' : ''}
									style={{ overflowY: 'auto', height: 380 }}
									tab='Toolbar'
									key='item-toolbar'>
								
									<Toolbar
										values={meetConfig.config.toolbarButtons}
										onChange={(list : any) =>
											setMeetConfig(prev => ({ ...prev, config: { ...prev.config, toolbarButtons: list } }))
										}
									/>
								</Tabs.TabPane>
							</Tabs>
						</Col>
					</Row>
		</>
	);
}
