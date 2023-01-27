import { GraphicsData } from '@/components/events/surveys/types';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import { Avatar, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';

interface Props {
	graphicsData: GraphicsData;
}


export default function PercentageSection(props: Props) {
  const { graphicsData } = props;
	// datos quemados solo para pruebas===================
	const arrayExample = Array.from({ length: 8 });
	function randomNumber() {
		return Math.floor(Math.random() * 11);
	}
	//====================================================
	return (
		<Card style={{ height: '100%', overflowY: 'auto' }}>
			<Row gutter={[16, 16]}>
				{arrayExample.map((item, index) => (
					<Col key={index} xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
						<Card bodyStyle={{ padding: '0px' }}>
							<Space align='start'>
								<Avatar size={80} shape='square' style={{ backgroundColor: `${'#c4c4c4'}` }}>
									{'A' + index}
								</Avatar>
								<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
									<span style={{ fontWeight: '600' }}>{singularOrPluralString(randomNumber(), 'Voto', 'Votos')}</span>
									<Typography.Paragraph
										style={{ color: '#808080', lineHeight: '1.25' }}
										ellipsis={{ rows: 2, expandable: false, tooltip: 'Respuesta' }}>
										{'Respuesta' + index}
									</Typography.Paragraph>
								</Space>
							</Space>
							<span style={{ position: 'absolute', top: '5px', right: '10px', fontWeight: '600' }}>{40}%</span>
						</Card>
					</Col>
				))}
			</Row>
		</Card>
	);
}
