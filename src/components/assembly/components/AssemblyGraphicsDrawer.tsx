import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { Button, Card, Col, Drawer, Pagination, PaginationProps, Row } from 'antd';
import { useState } from 'react';
import GraphicSection from './assemblyGraphicsSections/GraphicSection';
import ParticipationSection from './assemblyGraphicsSections/ParticipationSection';

export default function AssemblyGraphicsDrawer() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Button type='primary' onClick={handleOpen} icon={<ChartBarIcon />}></Button>
			<Drawer
				visible={open}
				width={'100vw'}
				title={<Pagination total={50} />}
				extra={'Aqui va el Quórum'}
				onClose={handleClose}
				destroyOnClose>
				<Row gutter={[16, 16]} style={{ height: 'calc(100vh - 125px)' }}>
					<Col style={{ height: '100%' }} span={12}>
						<Row style={{ height: '100%' }} gutter={[16, 16]}>
							<GraphicSection />
						</Row>
					</Col>
					<Col style={{ height: '100%' }} span={12}>
						<Row style={{ height: '100%' }} gutter={[16, 16]}>
							<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
								<Card style={{ height: '100%' }}>Aqui van las respuestas con sus porcentajes</Card>
							</Col>
							<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
								<ParticipationSection />
							</Col>
						</Row>
					</Col>
				</Row>
			</Drawer>
		</>
	);
}
