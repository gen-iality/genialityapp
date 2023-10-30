import { useState } from 'react';
import { useSearchList } from '@/hooks/useSearchList';
import { Badge, Button, Card, Col, Empty, Row, Space, Typography, Grid } from 'antd';
import { InputSearchEvent } from './InputSearchEvent';
import EventCard from '@/components/shared/eventCard';
import { Organization } from '../types';
import { createEventUserFree } from '@/components/authentication/services/RegisterUserToEvent';
import { useGetMyOrgUser } from '@/hooks/useGetMyOrgUser';
import { DispatchMessageService } from '@/context/MessageService';
import { useGetMyEventsInOrganization } from '../hooks/useGetMyEventsInOrganization';
import LoadingCard from './LoadingCard';

const { Title } = Typography;
const { useBreakpoint } = Grid;
interface Props {
	organization: Organization | null;
	setIsModalCertificatesOpen: (item: boolean) => void;
	organizationId: string;
	eventUserId: string;
	cUser: any;
}
export const MyEvents = ({ organization, setIsModalCertificatesOpen, organizationId, eventUserId, cUser }: Props) => {
	const screens = useBreakpoint();
	const { myUserOrg } = useGetMyOrgUser(organizationId);
	const {
		eventsFreeToOneOreUse,
		isLoadingEventsFreeToOneOreUs,
		getEventsFreeAcces,
		eventsWithEventUser,
	} = useGetMyEventsInOrganization(organizationId, eventUserId);
	const myAllEvents = [...eventsWithEventUser, ...eventsFreeToOneOreUse];
	const { filteredList: eventsWithUserfiltered, setSearchTerm: setSearchTermEventWithUser } = useSearchList(
		eventsWithEventUser,
		'name'
	);
	const { filteredList: eventsFreeFiltered, setSearchTerm: setSearchTermEventsFree } = useSearchList(
		eventsFreeToOneOreUse,
		'name'
	);
	const [isRegisteringEventUser, setIsRegisteringEventUser] = useState(false);

	const redirectToEventFreeAcces = async (event: any) => {
		try {
			const lastEventsFreeAcces = await getEventsFreeAcces();
			const accesToEvent = !!lastEventsFreeAcces.find((eventItem) => eventItem._id === event._id);
			if (!accesToEvent) {
				return DispatchMessageService({
					action: 'show',
					msj: 'Se le ha denegado el acceso al evento, pongase en contacto con el administrador',
					type: 'warning',
				});
			}
			setIsRegisteringEventUser(true);
			const dataNewUser = {
				names: cUser.value?.names,
				email: cUser.value?.email,
				...myUserOrg?.properties,
			};
			const resUser = await createEventUserFree(dataNewUser, event._id);

			if (resUser) {
				window.location.pathname = `/landing/${event._id}`;
			}
		} catch (error) {
			return DispatchMessageService({
				action: 'show',
				msj: 'A ocurrido un error al ingresar al evento, vuelva a intentarlo',
				type: 'warning',
			});
		} finally {
			setIsRegisteringEventUser(false);
		}
	};

	return (
		<>
			{myUserOrg && (
				<Card
					bodyStyle={{ paddingTop: '0px' }}
					headStyle={{ border: 'none' }}
					style={{ width: '100%', borderRadius: 20 }}
					title={
						<Badge offset={[60, 22]} count={`${myAllEvents.length} Eventos`}>
							<Title level={screens.xs ? 4 : 2}>Mis eventos</Title>
						</Badge>
					}
					extra={
						myAllEvents.length > 0 && (
							<Space>
								<InputSearchEvent
									onHandled={(serchTerm) => {
										setSearchTermEventWithUser(serchTerm);
										setSearchTermEventsFree(serchTerm);
									}}
								/>
							</Space>
						)
					}>
					<Row gutter={[0, 8]}>
						<Col span={24}>
							{organization?.show_my_certificates && myAllEvents.length > 0 && (
								<Button size='large' type='default' onClick={() => setIsModalCertificatesOpen(true)}>
									Mis certificados
								</Button>
							)}
						</Col>
						<Col span={24}>
							<Row style={{ overflowY: 'auto', minHeight: '300px', maxHeight: '500px' }} gutter={[16, 16]}>
								{isLoadingEventsFreeToOneOreUs ? (
									Array.from({ length: 6 }).map((item) => <LoadingCard />)
								) : (
									<>
										{eventsFreeToOneOreUse.length > 0 || eventsWithEventUser.length > 0 ? (
											<>
												{eventsWithUserfiltered.length > 0 || eventsFreeFiltered.length > 0 ? (
													<>
														{eventsWithUserfiltered.map((event, index) => (
															<Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
																<EventCard
																	bordered={false}
																	key={event._id}
																	event={event}
																	action={{ name: 'Ver', url: `landing/${event._id}` }}
																/>
															</Col>
														))}
														{eventsFreeFiltered.map((event, index) => (
															<Col
																key={event._id}
																xs={24}
																sm={12}
																md={12}
																lg={8}
																xl={6}
																xxl={4}
																style={{ cursor: 'pointer' }}
																onClick={() => {
																	if (!isRegisteringEventUser) redirectToEventFreeAcces(event);
																}}>
																<div style={{ pointerEvents: 'none' }}>
																	<EventCard
																		bordered={false}
																		key={event._id}
																		event={event}
																		action={{ name: 'Ver', url: `landing/${event._id}` }}
																	/>
																</div>
															</Col>
														))}
													</>
												) : (
													<div
														style={{
															height: '250px',
															width: '100%',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}>
														<Empty description='No se encontraron tus eventos con ese nombre' />
													</div>
												)}
											</>
										) : (
											<div
												style={{
													height: '250px',
													width: '100%',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
												}}>
												<Empty description='No estas inscritos en otros eventos' />
											</div>
										)}
									</>
								)}
							</Row>
						</Col>
					</Row>
				</Card>
			)}
		</>
	);
};
