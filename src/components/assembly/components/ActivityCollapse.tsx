import { numberDecimalToTwoDecimals } from '@/Utilities/numberDecimalToTwoDecimals';
import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Space, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { Activity, Survey } from '../types';
import AssemblySurveyCard from './AssemblySurveyCard';

interface Props {
	activity: Activity;
	surveys: Survey[];
	loading: boolean;
}

export default function ActivityCollapse(props: Props) {
	const { listenQuorum, totalAttendeesWeight } = useAssemblyInCMS();
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [quorum, setQuorum] = useState(0);
	const [attendeesOnline, setAttendeesOnline] = useState(0);
	const [attendeesVisited, setAttendeesVisited] = useState(0);
	const [attendeesOnlineWeight, setAttendeesOnlineWeight] = useState(0);

	useEffect(() => {
		listenQuorum(props.activity._id, setAttendeesOnline, setAttendeesVisited, setAttendeesOnlineWeight);
	}, []);

	useEffect(() => {
		const surveys = props.surveys.filter(survey => survey.activity_id === props.activity._id);
		setSurveys(surveys);
	}, [props.surveys, props.activity]);

	useEffect(() => {
		const quorum = numberDecimalToTwoDecimals((attendeesOnlineWeight / totalAttendeesWeight) * 100);
		setQuorum(quorum);
	}, [totalAttendeesWeight, attendeesOnlineWeight]);

	return (
		<Collapse
			expandIcon={({ isActive }) => (
				<Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>
			)}
			bordered={false}
			style={{ backgroundColor: '#F9FAFE' }}>
			<Collapse.Panel
				key='1'
				header={
					<Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>
						{props.activity.name}
					</Typography.Text>
				}
				extra={
					<Space className='custom-statistic' style={{ fontWeight: '700', color: '#6F737C' }} size={'large'} wrap>
						<Statistic
							loading={props.loading}
							valueStyle={{ fontSize: '18px', color: '#6F737C' }}
							title={'Visitas totales'}
							prefix={<AccountGroupIcon />}
							value={attendeesVisited}
						/>
						<Statistic
							loading={props.loading}
							valueStyle={{ fontSize: '18px', color: '#6F737C' }}
							title={'Conectados'}
							prefix={<AccountEyeIcon />}
							value={attendeesOnline}
						/>
						<Statistic
							loading={props.loading}
							valueStyle={{ fontSize: '18px', color: '#6F737C' }}
							title={'Quórum'}
							value={quorum}
							suffix='%'
						/>
					</Space>
				}>
				<Row gutter={[16, 16]}>
					{surveys.map((survey, index) => (
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
	);
}
