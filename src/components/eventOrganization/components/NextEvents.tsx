import { Badge, Card, Col, Empty, Row, Space, Typography } from 'antd';
import React from 'react';
import { InputSearchEvent } from './InputSearchEvent';
import { useSearchList } from '@/hooks/useSearchList';
import EventCard from '@/components/shared/eventCard';

const { Title } = Typography;

interface Props {
  events: any[];
}
export const NextEvents = ({ events }: Props) => {
  const { filteredList, searchTerm, setSearchTerm } = useSearchList(events, 'name');

	return (
		<Card
			bodyStyle={{ paddingTop: '0px', height:'100%',  overflowY: 'auto' }}
			headStyle={{ border: 'none' }}
			title={
				<Badge offset={[60, 22]} count={`${events.length} Eventos`}>
					<Title level={2}>Próximos eventos</Title>
				</Badge>
			}
			extra={<Space>{events.length > 0 && <InputSearchEvent onHandled={setSearchTerm} />}</Space>}
			style={{ width: '100%', borderRadius: 20, height: '600px',overflow:'hidden' }}>
			<Row gutter={[0, 32]}>
				<Col span={24}>
					<Row gutter={[16, 16]}>
						{events && events.length > 0 ? (
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
