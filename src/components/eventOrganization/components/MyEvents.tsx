import Loading from '@/components/profile/loading';
import { useSearchList } from '@/hooks/useSearchList';
import { Badge, Button, Card, Col, Empty, Row, Space, Typography } from 'antd';
import React from 'react';
import { InputSearchEvent } from './InputSearchEvent';
import EventCard from '@/components/shared/eventCard';
import { Organization } from '../types';

const { Title } = Typography;

interface Props {
	eventsWithEventUser: any[];
	isLoadingOtherEvents: boolean;
	organization: Organization | null;
	setIsModalCertificatesOpen: (item: boolean) => void;
}
export const MyEvents = ({
	eventsWithEventUser,
	isLoadingOtherEvents,
	organization,
	setIsModalCertificatesOpen,
}: Props) => {
	const { filteredList, searchTerm, setSearchTerm } = useSearchList(eventsWithEventUser, 'name');
	return (
		<>
			{/* Lista otros eventos en los que esta inscrito el usuario*/}
			<Card
				bodyStyle={{paddingTop:'0px'}}
				headStyle={{ border: 'none' }}
				title={
					<Badge offset={[60, 22]} count={`${eventsWithEventUser.length} Eventos`}>
						<Title level={2}>Mis eventos</Title>
					</Badge>
				}
				extra={
					<Space>
						{eventsWithEventUser.length > 0 && <InputSearchEvent onHandled={setSearchTerm} />}
						
					</Space>
				}
				style={{ width: '100%', borderRadius: 20 }}>
				<Row gutter={[0, 32]}>
					<Col span={24}>
					{organization?.show_my_certificates && (
						<Button size='large' type='default' onClick={() => setIsModalCertificatesOpen(true)}>
							Mis certificados
						</Button>
						)}
					</Col>
					<Col span={24}>
						<Row gutter={[16, 16]}>
							{isLoadingOtherEvents && (
								<div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
									<Loading />
								</div>
							)}
							{!isLoadingOtherEvents && eventsWithEventUser && eventsWithEventUser.length > 0 ? (
								<>
									{filteredList.length > 0 ? (
										filteredList.map((event, index) => (
											<Col key={index} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
												<EventCard
													bordered={false}
													key={event._id}
													event={event}
													action={{ name: 'Ver', url: `landing/${event._id}` }}
												/>
											</Col>
										))
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
						</Row>
					</Col>
				</Row>
			</Card>
		</>
	);
};
