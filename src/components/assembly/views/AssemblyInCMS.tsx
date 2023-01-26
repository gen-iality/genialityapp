import { Button, Card, Col, Collapse, Row, Space, Statistic, Switch, Tag, Timeline, Typography } from 'antd';
import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import AssemblySurveyCard from '../components/AssemblySurveyCard';

export default function AssemblyInCMS() {
	const arraySurveyExample = Array.from({ length: 4 }).map((_, i) => ({ id: `surveyId:${i}` }));
	return (
		<div style={{ padding: '40px' }}>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card>
						<Statistic title={'Inscritos / Registrados'} value={15} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title={'Asistencia / Checkeados'} value={15} />
					</Card>
				</Col>
				<Col span={24}>
					<Card>
						<Collapse>
							<Collapse.Panel
								key='1'
								header='Nombre actividad'
								showArrow={false}
								extra={
									<Space size={'large'} wrap>
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
										<Col span={8} key={survey.id}>
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
