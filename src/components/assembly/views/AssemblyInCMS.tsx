import { Card, Col, Collapse, Row } from 'antd';
import React from 'react';

export default function AssemblyInCMS() {
	return (
		<div style={{ padding: '40px' }}>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card>Inscritos / Registrados</Card>
				</Col>
				<Col span={12}>
					<Card>Asistencia / Checkeados</Card>
				</Col>
				<Col span={24}>
					<Card>
						<Collapse>
							<Collapse.Panel key='1' header='Nombre actividad' showArrow={false} extra={'Quorum'} ></Collapse.Panel>
						</Collapse>
					</Card>
				</Col>
			</Row>
		</div>
	);
}