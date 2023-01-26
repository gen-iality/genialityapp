import { Button, Card, Col, Collapse, Row, Space, Statistic, Typography } from 'antd';
import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import AssemblySurveyCard from '../components/AssemblySurveyCard';
import { CaretDownOutlined} from '@ant-design/icons';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';

export default function AssemblyInCMS() {
	const arraySurveyExample = Array.from({ length: 4 }).map((_, i) => ({ id: `surveyId:${i}` }));
	const {attendeesChecked, totalAttendees} = useAssemblyInCMS()
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
					<Card>
						<Collapse expandIcon={({isActive})=>(<Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>)} bordered={false} style={{backgroundColor:'#F9FAFE'}}>
							<Collapse.Panel
								key='1'
								header={<Typography.Text style={{fontSize:'20px', fontWeight:'700', color:'#6F737C' }}>Nombre de la actividad</Typography.Text>}
								extra={
									<Space style={{fontSize:'20px', fontWeight:'700', color:'#6F737C' }} size={'large'} wrap>
										<Space>
											<AccountGroupIcon />
											<Typography.Text>5</Typography.Text>
										</Space>
										<Space>
											<AccountEyeIcon />
											<Typography.Text>15</Typography.Text>
										</Space>
										<Space>
											Quórum
											<Typography.Text>45%</Typography.Text>
										</Space>
									</Space>
								}>
								<Row gutter={[16, 16]}>
									{arraySurveyExample.map((survey, index) => (
										<Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8} key={survey.id}>
											<AssemblySurveyCard
												status={index === 0 ? 'closed' : index === 1 ? 'opened' : 'finished'}
												title={`Encuesta ${index + 1}`}
												extra={<Button type='primary' icon={<ChartBarIcon />}></Button>}
											/>
										</Col>
									))}
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
