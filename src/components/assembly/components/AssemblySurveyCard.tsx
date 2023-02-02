import { VoteResponse } from '@/components/events/surveys/types';
import { changeSurveyStatus } from '@/services/surveys';
import { SurveyStatus } from '@/types/survey';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Card, Col, Comment, Modal, Row, Space, Statistic, Tag, Tooltip } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { ReactNode, useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { CardStatus, CardStatusProps, GraphicType, GraphicTypeResponse, Question, Survey } from '../types';
import AssemblyGraphicsDrawer from './AssemblyGraphicsDrawer';

interface Props {
	survey: Survey;
	quorumComponent: ReactNode;
}

const STATUS: Record<CardStatus, CardStatusProps> = {
	closed: {
		label: 'Cerrado',
		color: 'red',
		icon: <LockOutlined />,
		cursor: 'pointer',
		tooltip: 'Click para abrir la encuesta',
	},
	opened: {
		label: 'Abierto',
		color: 'green',
		icon: <UnlockOutlined />,
		cursor: 'pointer',
		tooltip: 'Click para cerrar la encuesta',
	},
	finished: {
		label: 'Finalizado',
		color: 'orange',
		cursor: 'default',
		tooltip: 'Esta encuesta ya fue contestada',
	},
};

const GRAPHIC_TYPE: Record<GraphicTypeResponse, GraphicType> = {
	x: 'horizontal',
	y: 'vertical',
	pie: 'pie',
};

export default function AssemblySurveyCard(props: Props) {
	const { survey, quorumComponent } = props;
	const { getAdditionalDataBySurvey, getCountResponses } = useAssemblyInCMS();
	const [status, setStatus] = useState<'closed' | 'opened' | 'finished'>('closed');
	const [responses, setResponses] = useState<VoteResponse[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [open, setOpen] = useState(false);
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('pie');
	const [loading, setLoading] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		if (!questions.length) {
			getAdditionalData();
		}
	}, []);

	useEffect(() => {
		if (questions[0]?.id) {
			const unsubscribe = getCountResponses(survey.id, questions[0].id, setResponses);
			return () => unsubscribe();
		}
	}, [questions]);

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
		} else if (!survey.isOpened && !!responses.length) {
			setStatus('finished');
		} else {
			setStatus('closed');
		}
	}, [survey.isOpened, responses.length]);

	useEffect(() => {
		console.log({ survey });
	}, [survey]);

	const handleChangeStatus = async () => {
		let payload: SurveyStatus = {} as SurveyStatus;
		let title: string = '';
		let content: string = '';
		if (status === 'closed') {
			payload = {
				isOpened: true,
			};
			title = 'Abrir encuesta';
			content = '¿Estas seguro de abrir la encuesta?';
		}
		if (status === 'opened') {
			payload = {
				isOpened: false,
			};
			title = 'Cerrar encuesta';
			content = '¿Estas seguro de cerrar la encuesta?';
		}
		if (status === 'finished') {
			return;
		}
		Modal.confirm({
			title,
			content,
			cancelText: 'Cancelar',
			okText: 'Aceptar',
			onOk: async () => {
				await changeSurveyStatus(survey.id, payload, survey.eventId, survey.activity_id, setLoading);
				console.log('cambia el estado');
			},
		});
	};

	return (
		<>
			<Card
				title={
					<Tooltip title={STATUS[status].tooltip}>
						<Tag
							onClick={() => handleChangeStatus()}
							style={{ cursor: STATUS[status].cursor, fontWeight: '500' }}
							icon={STATUS[status].icon}
							color={STATUS[status].color}>
							{STATUS[status].label}
						</Tag>
					</Tooltip>
				}
				style={{ height: '100%' }}
				headStyle={{ border: 'none', fontSize: '14px' }}
				bodyStyle={{ paddingTop: '0px', paddingBottom:'10px' }}
				extra={
					<Space>
						<Button type='primary' onClick={handleOpen} icon={<ChartBarIcon />}></Button>
					</Space>
				}
				actions={[]}>
				{/* <Card.Meta title={survey.name} description={'aqui se supone van las fechas'} /> */}
				<Card.Meta title={survey.name} />
				<Row>
					<Col span={12}>
						{survey.openedQuorum !== undefined && survey.openedTimestamp !== undefined ? (
							<Comment
								author='Inició el'
								datetime={
									<Space size={2} wrap>
										<span>{moment(survey.openedTimestamp).format('ll.')}</span>
										<span>{moment(survey.openedTimestamp).format('LT')}</span>
									</Space>
								}
								content={`Quórum ${survey.openedQuorum}%`}
							/>
						) : (
							<Comment
								author='Inició el'
								datetime={<span style={{ fontSize: '14px', letterSpacing: '1px' }}> --- -, ---- --:-- -- </span>}
								content={`Quórum --%`}
							/>
						)}
					</Col>
					<Col span={12}>
						{survey.closedQuorum !== undefined && survey.closedTimestamp !== undefined ? (
							<Comment
								author='Finalizó el'
								datetime={
									<Space size={2} wrap>
										<span>{moment(survey.closedTimestamp).format('ll.')}</span>
										<span>{moment(survey.closedTimestamp).format('LT')}</span>
									</Space>
								}
								content={`Quórum ${survey.closedQuorum}%`}
							/>
						) : (
							<Comment
								author='Finalizó el'
								datetime={<span style={{ fontSize: '14px', letterSpacing: '1px' }}> --- -, ---- --:-- -- </span>}
								content={`Quórum --%`}
							/>
						)}
					</Col>
				</Row>
			</Card>
			{!!survey && !!questions.length && open && (
				<AssemblyGraphicsDrawer
					quorumComponent={quorumComponent}
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
