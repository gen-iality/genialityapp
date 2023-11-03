/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
import { Col, Row, Grid, Card } from 'antd';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { OrganizationApi, OrganizationFuction } from '../../helpers/request';
import moment from 'moment';
import ModalLoginHelpers from '../authentication/ModalLoginHelpers';
import Loading from '../profile/loading';
import { DataOrganizations, Organization, OrganizationProps } from './types';
import { UseCurrentUser } from '@/context/userContext';
import { useGetEventsWithUser } from './hooks/useGetEventsWithUser';
import { ModalCertificatesByOrganizacionAndUser } from './components/ModalCertificatesByOrganizacionAndUser';
import { SocialNetworks } from './components/SocialNetworks';
import { MyEvents } from './components/MyEvents';
import { NextEvents } from './components/NextEvents';
import { PassEvents } from './components/PassEvents';
import ContactInfo from './components/ContactInfo';

const { useBreakpoint } = Grid;

function EventOrganization({ match }: OrganizationProps) {
	const screens = useBreakpoint();
	const cUser = UseCurrentUser();

	const [state, setstate] = useState<DataOrganizations>({
		orgId: '',
		view: false,
	});
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [events, setEvents] = useState<any[]>([]);
	const [eventsOld, setEventsOld] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isModalCertificatesOpen, setIsModalCertificatesOpen] = useState(false);
	const organizationId = match.params.id;
	const eventUserId = cUser.value?._id;
	const { eventsWithEventUser, isLoading: isLoadingOtherEvents } = useGetEventsWithUser(organizationId, eventUserId);

	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		fetchOrganizationUser();
	}, [organization, cUser?.value?._id]);

	const fetchOrganizationUser = async () => {
		try {
			const response = await OrganizationApi.getMeUser(organizationId);
			const user = response.data[0]?.active ?? true;
			setIsActive(user);
		} catch (error) {
			console.error('Error al obtener el usuario de la organización:', error);
		}
	};
	useEffect(() => {
		if (organizationId) {
			fetchItem().then((respuesta) =>
				setstate({
					...state,
					orgId: organizationId,
				})
			);
			setLoading(false);
		}
	}, [organizationId]);

	const fetchItem = async () => {
		const events = await OrganizationFuction.getEventsNextByOrg(organizationId, 'desc');
		let proximos: any = [];
		let pasados: any = [];
		let fechaActual = moment();
		events.forEach((event: any) => {
			if (Array.isArray(event.dates) && event.dates.length > 0) {
				if (moment(event.dates[0]?.start).isAfter(fechaActual)) {
					proximos.push(event);
				} else {
					pasados.push(event);
				}
			} else if (moment(event.datetime_from).isAfter(fechaActual)) {
				proximos.push(event);
			} else {
				pasados.push(event);
			}
		});

		const orga = await OrganizationFuction.obtenerDatosOrganizacion(organizationId);
		if (events) {
			setEvents(proximos);
			setEventsOld(pasados);
			setOrganization(orga);
		}
		setLoading(false);
	};

	//toDo: Se debe realizar esta validacion desde el backedn para mejor optimizacion
	const isUserRegisterInEvent = (eventId: string): boolean => {
		if (eventsWithEventUser.filter((event) => event._id === eventId).length > 0) {
			return true;
		}
		return false;
	};

	const havePaymentEvent = (event: any): boolean => {
		return event.payment ? (event.payment.active as boolean) : false;
	};

	return (
		<div
			style={{
				backgroundImage: `url(${organization?.styles?.BackgroundImage})`,
				backgroundColor: `${organization?.styles?.containerBgColor ?? '#FFFFFF'}`,
			}}>
			<SocialNetworks organization={organization} />
			<ModalLoginHelpers />
			{!loading && state.orgId ? (
				<>
					{organization !== null && (
						<div style={{ width: '100%' }}>
							{organization.styles?.banner_image !== null || '' ? (
								<img
									style={{ objectFit: screens.xxl ? 'fill' : 'cover', width: '100%', maxHeight: '400px' }}
									src={organization.styles?.banner_image}
								/>
							) : (
								''
							)}
						</div>
					)}
					{isActive || !cUser?.value ? (
						<Row style={{ padding: '30px' }} gutter={[0, 30]}>
							{cUser.value?._id && (
								<Col span={24}>
									<MyEvents
										cUser={cUser}
										organizationId={organizationId}
										eventUserId={eventUserId}
										organization={organization}
										setIsModalCertificatesOpen={setIsModalCertificatesOpen}
									/>
									{isModalCertificatesOpen && (
										<ModalCertificatesByOrganizacionAndUser
											destroyOnClose
											visible={isModalCertificatesOpen}
											onCloseDrawer={() => setIsModalCertificatesOpen(false)}
											eventUserId={cUser.value?._id}
											organizationId={match.params.id}
											orgContainerBg={organization?.styles?.containerBgColor}
											orgTextColor={organization?.styles?.textMenu}
										/>
									)}
								</Col>
							)}
							<Col span={24}>
								<PassEvents
									eventsOld={eventsOld}
									havePaymentEvent={havePaymentEvent}
									isUserRegisterInEvent={isUserRegisterInEvent}
								/>
							</Col>
							<Col span={24}>
								<NextEvents events={events} />
							</Col>
						</Row>
					) : (
						<Row justify='center' style={{ paddingTop: '32px', paddingBottom: '32px' }}>
							<Col xs={24} sm={24} md={20} lg={12} xl={12} xxl={12}>
								<Card style={{ width: '100%', borderRadius: 20, margin: '0 auto' }}>
									<ContactInfo organization={organization} />
								</Card>
							</Col>
						</Row>
					)}
					{/* FOOTER */}
					{organization !== null && (
						<div style={{ width: '100%', maxHeight: '350px' }}>
							{organization.styles?.banner_footer || '' ? (
								<img
									style={{ objectFit: 'cover', width: '100%', maxHeight: '250px' }}
									src={organization.styles?.banner_footer}
								/>
							) : (
								''
							)}
						</div>
					)}
				</>
			) : (
				<div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
					<Loading />
				</div>
			)}
		</div>
	);
}
export default withRouter(EventOrganization);
