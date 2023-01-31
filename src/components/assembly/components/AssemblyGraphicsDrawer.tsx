import { GraphicsData, VoteResponse } from '@/components/events/surveys/types';
import { Col, Drawer, Pagination, Row, Space, Typography } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { GraphicType, Question, Survey } from '../types';
import GraphicSection from './assemblyGraphicsSections/GraphicSection';
import ParticipationSection from './assemblyGraphicsSections/ParticipationSection';
import PercentageSection from './assemblyGraphicsSections/PercentageSection';

interface Props {
	initialQuestion: string;
	survey: Survey;
	questions: Question[];
	open: boolean;
	handleClose: () => void;
	graphicType: GraphicType;
	quorumComponent: ReactNode;
}

export default function AssemblyGraphicsDrawer(props: Props) {
	// const { survey, questions, open, handleClose, initialQuestion } = props;
	const { survey, questions, open, handleClose, initialQuestion, graphicType, quorumComponent } = props;
	const { listenAnswersQuestion } = useAssemblyInCMS();
	const [currentPage, setCurrentPage] = useState(1);
	const [responses, setResponses] = useState<VoteResponse[]>([]);
	const [questionSelected, setQuestionSelected] = useState(initialQuestion);
	const [graphicsData, setGraphicsData] = useState<GraphicsData>({
		dataValues: [],
		labels: [],
		labelsToShow: [],
	});
	// const [graphicType, setGraphicType] = useState<GraphicType>('pie');

	useEffect(() => {
		const unsubscribe = listenAnswersQuestion(survey.id, questionSelected, setGraphicsData, setResponses);
		return () => unsubscribe();
	}, [questionSelected, graphicType]);

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
		setQuestionSelected(questions[page - 1].id);
	};

	return (
		<Drawer
			visible={open}
			width={'100%'}
			title={
				<Space split='|'>
					<Typography.Text strong>{survey.name}</Typography.Text>
					{quorumComponent}
				</Space>
			}
			extra={
				<Space split='|'>
					<Typography.Text type='secondary'>Preguntas</Typography.Text>
					<Pagination
					current={currentPage}
					onChange={handleChangePage}
					total={questions.length * 10}
					defaultCurrent={1}
				/>
				</Space>
				
			}
			onClose={handleClose}
			bodyStyle={{backgroundColor:'#F9FAFE'}}
			destroyOnClose>
			<Row gutter={[16, 16]} style={{ height: 'calc(100vh - 125px)' }}>
				<Col style={{ height: '100%' }} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<Row style={{ height: '100%' }} gutter={[16, 16]}>
						<GraphicSection
							graphicType={graphicType}
							question={questions[currentPage - 1]}
							// setGraphicType={setGraphicType}
							survey={survey}
							questionSelectedId={questionSelected}
							graphicsData={graphicsData}
							// graphicType={graphicType}
						/>
					</Row>
				</Col>
				<Col style={{ height: '100%' }} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<Row style={{ height: '100%' }} gutter={[16, 16]}>
						<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
							<PercentageSection graphicsData={graphicsData} />
						</Col>
						<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
							<ParticipationSection graphicsData={graphicsData} responses={responses} />
						</Col>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
}
