import AccountEyeIcon from '@2fd/ant-design-icons/lib/AccountEye';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Activity, Survey } from '../types';
import AssemblySurveyCard from './AssemblySurveyCard';

interface Props {
	activity: Activity;
	surveys: Survey[];
}

export default function ActivityCollapse(props: Props) {
	const [surveys, setSurveys] = useState<Survey[]>([]);

	useEffect(() => {
		const surveys = props.surveys.filter(survey => survey.activity_id === props.activity._id);
		setSurveys(surveys);
	}, [props.surveys, props.activity]);

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
						Nombre de la actividad
					</Typography.Text>
				}
				extra={
					<Space style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }} size={'large'} wrap>
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
