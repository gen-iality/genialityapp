import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { Button, Card, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CardStatus, CardStatusProps, Survey } from '../types';
import AssemblyGraphicsDrawer from './AssemblyGraphicsDrawer';

interface Props {
	survey: Survey;
}

const STATUS: Record<CardStatus, CardStatusProps> = {
	closed: {
		label: 'Cerrado',
		color: 'red',
	},
	opened: {
		label: 'Abierto',
		color: 'green',
	},
	finished: {
		label: 'Finalizado',
		color: 'orange',
	},
};

export default function AssemblySurveyCard(props: Props) {
	const { survey } = props;
	const [status, setStatus] = useState<'closed' | 'opened' | 'finished'>('closed');
	const [responses, setResponses] = useState([]);

	useEffect(() => {
		if (survey.isOpened) {
			setStatus('opened');
		} else if (survey.isOpened && !!responses.length) {
			setStatus('finished');
		} else {
			setStatus('closed');
		}
	}, [survey.isOpened, responses.length]);

	return (
		<Card
			hoverable
			title={
				<Space size={0} style={{ fontWeight: '500' }}>
					<Tag color={STATUS[status].color}>{STATUS[status].label}</Tag>
				</Space>
			}
			headStyle={{ border: 'none', fontSize: '14px' }}
			bodyStyle={{ paddingTop: '0px' }}
			extra={<AssemblyGraphicsDrawer />}
			actions={[]}>
			<Card.Meta title={survey.name} description={'aqui se supone van las fechas'} />
		</Card>
	);
}

AssemblySurveyCard;
