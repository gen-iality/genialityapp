import { Button, Card, Col, Result, Row, Statistic } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import ActivityCollapse from '../components/ActivityCollapse';

export default function AssemblyInCMS() {
	const { attendeesChecked, totalAttendees, isAssemblyMood, activities, surveys } = useAssemblyInCMS();

	if (!isAssemblyMood)
		<div style={{ padding: '40px' }}>
			<Row>
				<Card>
					<Result
						title='Contenido no disponible'
						subTitle='Para ingresar a esta sección debes de activar el modo asambleas'
					/>
				</Card>
			</Row>
		</div>;

	return (
		<div style={{ padding: '40px' }}>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card>
						<Statistic title={'Inscritos / Registrados'} value={totalAttendees} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title={'Asistencia / Checkeados'} value={attendeesChecked} />
					</Card>
				</Col>
				<Col span={24}>
					<Card
						headStyle={{ border: 'none' }}
						bodyStyle={{ paddingTop: '0px' }}
						extra={
							<Button type='primary' icon={<ReloadOutlined />}>
								Actualizar
							</Button>
						}>
						{!!activities.length &&
							activities.map(activity => <ActivityCollapse surveys={surveys} activity={activity} />)}
					</Card>
				</Col>
			</Row>
		</div>
	);
}
