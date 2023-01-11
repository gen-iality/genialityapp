import { Badge, Card, Col, Image, List, Row, Space, Tag } from 'antd';
import useWhereIs from '../../hooks/useWhereIs';

export default function ListPoints() {
	const { points } = useWhereIs();

	return (
		<List
			style={{ padding: '10px' }}
			grid={{ xs: 2, sm: 2, md: 3, lg: 5, xl: 5, xxl: 5, gutter: 16 }}
			dataSource={points}
			renderItem={(point, index) => (
				<List.Item key={`point-${point.id}-${point.label}`}>
					<Badge offset={[-20, 20]} count={`${index + 1}`}>
						<Card bodyStyle={{ textAlign: 'center' }}>
							<Row>
								<Col span={24}>
									<Image
										src={point.image}
										height={100}
										fallback={'https://via.placeholder.com/500/?text=Sin imagen'}
										preview={false}
										style={{
											maxWidth: '100px',
											objectFit: 'contain',
										}}
									/>
								</Col>
								<Space align='start' direction='vertical'>
									<Space>
										X<Tag>{+point.x.toFixed(2)}</Tag>
									</Space>
									<Space>
										Y<Tag>{+point.y.toFixed(2)}</Tag>
									</Space>
								</Space>
							</Row>
						</Card>
					</Badge>
				</List.Item>
			)}
		/>
	);
}
