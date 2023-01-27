import { GraphicsData } from '@/components/events/surveys/types';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import { Avatar, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';

interface Props {
	graphicsData: GraphicsData;
}


export default function PercentageSection(props: Props) {
  const { graphicsData } = props;
	return (
		<Card style={{ height: '100%', overflowY: 'auto' }}>
			<Row gutter={[16, 16]}>
				{graphicsData.labels.map(({color, letter, question, percentage, quantity}) => (
					<Col key={question} xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
						<Card bodyStyle={{ padding: '0px' }}>
							<Space align='start'>
								<Avatar size={80} shape='square' style={{ backgroundColor: `${color}` }}>
									{letter}
								</Avatar>
								<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
									<span style={{ fontWeight: '600' }}>{singularOrPluralString(quantity, 'Voto', 'Votos')}</span>
									<Typography.Paragraph
										style={{ color: '#808080', lineHeight: '1.25' }}
										ellipsis={{ rows: 2, expandable: false, tooltip: 'Respuesta' }}>
										{question}
									</Typography.Paragraph>
								</Space>
							</Space>
							<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>{percentage}%</span>
						</Card>
					</Col>
				))}
			</Row>
		</Card>
	);
}
