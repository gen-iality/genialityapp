import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import { Avatar, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';

export default function PercentageSection() {
	const arrayExample = Array.from({ length: 8 });
	return (
		<Card style={{ height: '100%' }}>
			<Row gutter={[16, 16]}>
				{arrayExample.map((item, index) => (
					<Col key={index} xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
						<Card bodyStyle={{ padding: '0px' }}>
							<Space align='start'>
								<Avatar size={80} shape='square' style={{ backgroundColor: `${'#c4c4c4'}` }}>
									{'A' + index}
								</Avatar>
								<Space style={{ padding: '5px' }} size={0} align='start' direction='vertical'>
									<span style={{ fontWeight: '600' }}>{singularOrPluralString(5, 'Voto', 'Votos')}</span>
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
