import { Button, Card, Space, Tag } from 'antd';
import { CardStatus, CardStatusProps } from '../types';

interface props {
	status: CardStatus;
	title: React.ReactNode | string;
	extra?: React.ReactNode | string;
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

const AssemblySurveyCard = (props: props) => {
	const { status, title, extra } = props;

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
			extra={extra}
			actions={[]}>
			<Card.Meta title={title} description={'aqui se supone van las fechas'} />
		</Card>
	);
};

export default AssemblySurveyCard;
