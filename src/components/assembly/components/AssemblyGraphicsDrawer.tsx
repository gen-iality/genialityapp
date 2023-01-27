import { Card, Col, Drawer, Pagination, PaginationProps, Row } from 'antd';
import { useState } from 'react';

export default function AssemblyGraphicsDrawer() {
	return (
		<Drawer visible={true} width={'100vw'} title={<Pagination total={50} />}  extra={'Aqui va el Quórum'} >
			<Row gutter={[16, 16]} style={{ height: 'calc(100vh - 125px)' }}>
				<Col style={{ height: '100%' }} span={12}>
					<Row style={{ height: '100%',  }} gutter={[16, 16]}>
						<Card style={{ height: '100%', width:'100%' }}>Aqui va la grafica</Card>
					</Row>
				</Col>
				<Col style={{ height: '100%' }} span={12}>
					<Row style={{ height: '100%' }} gutter={[16, 16]}>
						<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
							<Card style={{ height: '100%' }}>Aqui van las respuestas con sus porcentajes</Card>
						</Col>
						<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
							<Card style={{ height: '100%' }}>Aqui van los valores de participacion</Card>
						</Col>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
}
