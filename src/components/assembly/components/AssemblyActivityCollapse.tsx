import { numberDecimalToTwoDecimals } from '@/Utilities/numberDecimalToTwoDecimals';
import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import { ArrowDownOutlined, ArrowUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Space, Statistic, Typography, Grid, Tag, Result, Card } from 'antd';
import { useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { Activity, Survey } from '../types';
import AssemblySurveyCard from './AssemblySurveyCard';

interface Props {
	activity: Activity;
	surveys: Survey[];
	loading: boolean;
}

const { useBreakpoint } = Grid;

const arrows = {
	up: <ArrowUpOutlined style={{ color: '#52C41A' }} />,
	down: <ArrowDownOutlined style={{ color: '#FF4D4F' }} />,
	none: <></>,
};

export default function AssemblyActivityCollapse(props: Props) {
	const { listenQuorum, totalAttendeesWeight } = useAssemblyInCMS();
	const [surveys, setSurveys] = useState<Survey[]>([]);
	const [quorum, setQuorum] = useState(0);
	const [quorumLastChange, setQuorumLastChange] = useState<'none' | 'up' | 'down'>('none');
	const [attendeesState, setAttendeesState] = useState({
		online: 0,
		visited: 0,
		weight: 0,
	});
	const screens = useBreakpoint();

	useEffect(() => {
		listenQuorum(props.activity._id, setAttendeesState);
	}, []);

	useEffect(() => {
		const surveys = props.surveys.filter((survey) => survey.activity_id === props.activity._id);
		setSurveys(surveys);
	}, [props.surveys, props.activity]);

	useEffect(() => {
		if (!!attendeesState.weight || !!totalAttendeesWeight) {
			const quorum = numberDecimalToTwoDecimals((attendeesState.weight / totalAttendeesWeight) * 100);
			setQuorum((prev) => {
				if (prev > quorum) {
					setQuorumLastChange('down');
				} else {
					setQuorumLastChange('up');
				}
				return quorum;
			});
		} else {
			setQuorum(0);
		}
	}, [totalAttendeesWeight, attendeesState.weight]);

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
					/** se esconde en mobile */
					!screens.xs && (
						<Space className='custom-statistic' style={{ fontWeight: '700', color: '#6F737C' }} size={'large'} wrap>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={'Visitas totales'}
								prefix={<AccountGroupIcon />}
								value={attendeesState.visited}
							/>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={'Conectados'}
								prefix={<AccountEyeIcon />}
								value={attendeesState.online}
							/>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={<>Quórum {arrows[quorumLastChange]}</>}
								decimalSeparator=','
								value={quorum}
								suffix='%'
							/>
						</Space>
					)
				}>
				<Row gutter={[16, 16]}>
					{/** solo sale en mobile */
					screens.xs && (
						<Space className='custom-statistic' style={{ fontWeight: '700', color: '#6F737C' }} size={'large'} wrap>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={'Visitas totales'}
								prefix={<AccountGroupIcon />}
								value={attendeesState.visited}
							/>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={'Conectados'}
								prefix={<AccountEyeIcon />}
								value={attendeesState.online}
							/>
							<Statistic
								loading={props.loading}
								valueStyle={{ fontSize: '18px', color: '#6F737C' }}
								title={<>Quórum {arrows[quorumLastChange]}</>}
								decimalSeparator=','
								value={quorum}
								suffix='%'
							/>
						</Space>
					)}
					{!!surveys.length ? (
						surveys.map((survey, index) => (
							<Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8} key={survey.id}>
								<AssemblySurveyCard
									survey={survey}
									quorumComponent={<Tag color={quorum > 50 ? 'success' : 'default'}>Quórum {quorum + ' %'}</Tag>}
								/>
							</Col>
						))
					) : (
						<Col span={24}>
							<Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{padding:'5px'}}>
								<Result
								style={{padding:'10px'}}
									icon=' '
									title='No tienes encuestas publicadas para esta actividad '
									subTitle='Dirígete al módulo de encuestas para publicarlas'
									extra={<Button type='primary' size='large'>Ir a encuestas</Button>}
								/>
							</Card>
						</Col>
					)}
				</Row>
			</Collapse.Panel>
		</Collapse>
	);
}
