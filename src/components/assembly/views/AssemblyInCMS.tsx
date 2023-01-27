import { Button, Card, Col, Result, Row, Space, Statistic } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import ActivityCollapse from '../components/ActivityCollapse';
import AssemblyStatisticCard from '../components/AssemblyStatisticCard';

interface StatisticsAssembly {
	loading: boolean;
	title: React.ReactNode | string;
	value: number | string;
}

export default function AssemblyInCMS() {
	const { attendeesChecked, totalAttendees, isAssemblyMood, activities, surveys, loading } = useAssemblyInCMS();
	const statistics: StatisticsAssembly[] = [
		{ loading: loading, title: 'Inscritos en el evento', value: totalAttendees },
		{ loading: loading, title: 'Asistieron', value: attendeesChecked },
	];
	if (!isAssemblyMood) {
		return (
			<div style={{ padding: '40px' }}>
				<Row>
					<Col span={24}>
						<Card>
							<Result
								title='Contenido no disponible'
								subTitle='Para ingresar a esta sección debes de activar el modo asambleas en la opción del menu Configuración de asistentes, Datos/Campos a recolectar de asistentes.'
							/>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
	return (
		<div style={{ padding: '40px' }}>
			<Row gutter={[16, 16]}>
				{statistics.map(({ loading, title, value }) => (
					<Col span={12}>
						<AssemblyStatisticCard loading={loading} title={title} value={value} />
					</Col>
				))}
				<Col span={24}>
					<Card
						headStyle={{ border: 'none' }}
						bodyStyle={{ paddingTop: '0px' }}
						extra={
							<Button type='primary' icon={<ReloadOutlined />}>
								Actualizar
							</Button>
						}>
						<Row gutter={[0, 16]}>
							{!!activities.length &&
								activities.map((activity) => (
									<Col key={activity._id} span={24}>
										<ActivityCollapse surveys={surveys} activity={activity} loading={loading} />
									</Col>
								))}
						</Row>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
