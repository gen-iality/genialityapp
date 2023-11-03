import { Badge, Card, Col, Empty, Grid, Row, Space, Typography } from 'antd';
import React from 'react';
import { InputSearchEvent } from './InputSearchEvent';
import { useSearchList } from '@/hooks/useSearchList';
import EventCard from '@/components/shared/eventCard';
import useGetNextEvents from '../hooks/useGetNextEvents';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface Props {
	organizationId: string;
}
export const NextEvents = ({ organizationId }: Props) => {
	const screens = useBreakpoint();
	const { nextEvents } = useGetNextEvents(organizationId)
	const { filteredList, setSearchTerm } = useSearchList(nextEvents, 'name');

	return (
		<Card
			bodyStyle={{ paddingTop: '0px' }}
			headStyle={{ border: 'none' }}
			title={
				<Badge offset={[60, 22]} count={`${nextEvents.length} Eventos`}>
					<Title level={screens.xs ? 4 : 2}>Próximos eventos</Title>
				</Badge>
			}
			extra={<Space>{nextEvents.length > 0 && <InputSearchEvent onHandled={setSearchTerm} />}</Space>}
			style={{ width: '100%', borderRadius: 20 }}>
			<Row gutter={[0, 32]}>
				<Col span={24}>
					<Row style={{ overflowY: 'auto', minHeight: '300px', maxHeight: '500px' }} gutter={[16, 16]}>
						{nextEvents && nextEvents.length > 0 ? (
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
										<Empty description='No hay eventos próximos agendados con ese nombre' />
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
								<Empty description='No hay eventos próximos agendados' />
							</div>
						)}
					</Row>
				</Col>
			</Row>
		</Card>
	);
};
