import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { Button, Card, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { CardStatus, CardStatusProps, GraphicType, GraphicTypeResponse, Question, Survey } from '../types';
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

const GRAPHIC_TYPE: Record<GraphicTypeResponse, GraphicType> = {
	x: 'horizontal',
	y: 'vertical',
	pie: 'pie',
};

export default function AssemblySurveyCard(props: Props) {
	const { survey } = props;
	const { getAdditionalDataBySurvey } = useAssemblyInCMS();
	const [status, setStatus] = useState<'closed' | 'opened' | 'finished'>('closed');
	const [responses, setResponses] = useState([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [open, setOpen] = useState(false);
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('pie');

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		if (!questions.length) {
			getAdditionalData();
		}
	}, []);

	const getAdditionalData = async () => {
		try {
			const { questions, graphicType } = await getAdditionalDataBySurvey(props.survey.id);
			setGraphicType(GRAPHIC_TYPE[graphicType]);
			setQuestions(questions);
		} catch (error) {
			console.log(error);
		}
	};

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
		<>
			<Card
				hoverable
				title={
					<Space size={0} style={{ fontWeight: '500' }}>
						<Tag color={STATUS[status].color}>{STATUS[status].label}</Tag>
					</Space>
				}
				headStyle={{ border: 'none', fontSize: '14px' }}
				bodyStyle={{ paddingTop: '0px' }}
				extra={<Button type='primary' onClick={handleOpen} icon={<ChartBarIcon />}></Button>}
				actions={[]}>
				<Card.Meta title={survey.name} description={'aqui se supone van las fechas'} />
			</Card>
			{!!survey && !!questions.length && open && (
				<AssemblyGraphicsDrawer
					graphicType={graphicType}
					open={open}
					survey={survey}
					questions={questions}
					handleClose={handleClose}
					initialQuestion={questions[0].id}
				/>
			)}
		</>
	);
}
