import { Button, Card, Col, Grid, Result, Row } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import AssemblyActivityCollapse from '../components/AssemblyActivityCollapse';
import AssemblyStatisticCard from '../components/AssemblyStatisticCard';
import AccountMultipleCheckIcon from '@2fd/ant-design-icons/lib/AccountMultipleCheck';
import ClipboardListIcon from '@2fd/ant-design-icons/lib/ClipboardList';
interface StatisticsAssembly {
	loading: boolean;
	title: React.ReactNode | string;
	value: number | string;
	icon: React.ReactNode;
}

const { useBreakpoint } = Grid;

export default function AssemblyInCMS() {
	const screens = useBreakpoint();
	const {
		attendeesChecked,
		totalAttendees,
		isAssemblyMood,
		activities,
		surveys,
		loading,
		getActivities,
	} = useAssemblyInCMS();
	const statistics: StatisticsAssembly[] = [
		{ loading: loading, title: 'Inscritos en el evento', value: totalAttendees, icon: <ClipboardListIcon /> },
		{ loading: loading, title: 'Chequeados en el evento', value: attendeesChecked, icon: <AccountMultipleCheckIcon /> },
	];
	if (!isAssemblyMood) {
		return (
			<div style={{ padding: screens.xs ? '10px' : '40px' }}>
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
		<div style={{ padding: screens.xs ? '10px' : '40px' }}>
			<Row gutter={[16, 16]}>
				{statistics.map(({ loading, title, value, icon }, index) => (
					<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} key={`${title}-${index}`}>
						<AssemblyStatisticCard loading={loading} title={title} value={value} icon={icon} />
					</Col>
				))}
				<Col span={24}>
					<Card
						headStyle={{ border: 'none' }}
						bodyStyle={{ paddingTop: '0px' }}
						extra={
							<Button type='primary' icon={<ReloadOutlined />} onClick={getActivities}>
								Actualizar
							</Button>
						}>
						<Row gutter={[0, 16]}>
							{!!activities.length &&
								activities.map((activity) => (
									<Col key={activity._id} span={24}>
										<AssemblyActivityCollapse surveys={surveys} activity={activity} loading={loading} />
									</Col>
								))}
						</Row>
					</Card>
				</Col>
			</Row>
			{/* <AssemblyGraphicsDrawer/> */}
		</div>
	);
}
