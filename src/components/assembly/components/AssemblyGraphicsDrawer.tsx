import { GraphicsData, VoteResponse } from '@/components/events/surveys/types';
import Loading from '@/components/profile/loading';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { Button, Col, Drawer, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { Question, Survey } from '../types';
import GraphicSection from './assemblyGraphicsSections/GraphicSection';
import ParticipationSection from './assemblyGraphicsSections/ParticipationSection';
import PercentageSection from './assemblyGraphicsSections/PercentageSection';

interface Props {
	initialQuestion: string;
	survey: Survey;
	questions: Question[];
	open: boolean;
	handleClose: () => void;
}

export default function AssemblyGraphicsDrawer(props: Props) {
	const { survey, questions, open, handleClose, initialQuestion } = props;
	const { listenAnswersQuestion } = useAssemblyInCMS();
	const [currentPage, setCurrentPage] = useState(1);
	const [responses, setResponses] = useState<VoteResponse[]>([]);
	const [questionSelected, setQuestionSelected] = useState(initialQuestion);
	const [graphicsData, setGraphicsData] = useState<GraphicsData>({
		dataValues: [],
		labels: [],
		labelsToShow: [],
	});

	useEffect(() => {
		const unsubscribe = listenAnswersQuestion(survey.id, questionSelected, setGraphicsData, setResponses);
		return () => unsubscribe();
	}, [questionSelected]);

	const handleChangePage = (page: number, pageSize: number) => {
		// console.log('AssemblyGraphicsDrawer: questions page', page);
		setCurrentPage(page);
		setQuestionSelected(questions[page - 1].id);
	};

	// useEffect(() => {
	// 	const timerCleaner = setTimeout(() => {
	// 		// setCurrentPage(1);
	// 		console.log('AssemblyGraphicsDrawer: questions executing')
	// 	}, 500);
	// 	return () => clearTimeout(timerCleaner);
	// }, []);

	// useEffect(() => {
	// 	console.log('AssemblyGraphicsDrawer: questions', survey.id, survey.name, graphicsData);
	// }, [graphicsData]);

	// useEffect(() => {
	// 	console.log('AssemblyGraphicsDrawer: questions', loading);
	// }, [loading]);

	// useEffect(() => {
	// 	console.log('AssemblyGraphicsDrawer: questionSelected', questionSelected);
	// }, [questionSelected]);

	return (
		<Drawer
			visible={open}
			width={'100%'}
			title={
				<Pagination
					current={currentPage}
					onChange={handleChangePage}
					total={questions.length * 10}
					defaultCurrent={1}
				/>
			}
			extra={''}
			onClose={handleClose}
			destroyOnClose>
			<Row gutter={[16, 16]} style={{ height: 'calc(100vh - 125px)' }}>
				<Col style={{ height: '100%' }} span={12} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<Row style={{ height: '100%' }} gutter={[16, 16]}>
						{/* {loading ? <Loading /> : <GraphicSection graphicsData={graphicsData} id={survey.id} />} */}
						<GraphicSection survey={survey} questionSelectedId={questionSelected} graphicsData={graphicsData} />
					</Row>
				</Col>
				<Col style={{ height: '100%' }} span={12} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
