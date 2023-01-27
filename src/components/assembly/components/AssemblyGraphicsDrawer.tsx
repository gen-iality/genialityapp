import { GraphicsData } from '@/components/events/surveys/types';
import ChartBarIcon from '@2fd/ant-design-icons/lib/ChartBar';
import { Button, Col, Drawer, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import useAssemblyInCMS from '../hooks/useAssemblyInCMS';
import { Question, Survey } from '../types';
import GraphicSection from './assemblyGraphicsSections/GraphicSection';
import ParticipationSection from './assemblyGraphicsSections/ParticipationSection';
import PercentageSection from './assemblyGraphicsSections/PercentageSection';

interface Props {
	survey: Survey;
	questions: Question[];
}

export default function AssemblyGraphicsDrawer(props: Props) {
	const { survey, questions } = props;
	const { listenAnswersQuestion } = useAssemblyInCMS();
	const [open, setOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [graphicsData, setGraphicsData] = useState<GraphicsData>({
		dataValues: [],
		labels: [],
		labelsToShow: [],
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		console.log('Test:', questions)
		if (questions.length) {
			const unsubscribe = listenAnswersQuestion(survey.id, questions[currentPage - 1].id, setGraphicsData);
			return () => unsubscribe();
		}
	}, [questions]);

	const handleChangePage = (page: number, pageSize: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<Button type='primary' onClick={handleOpen} icon={<ChartBarIcon />}></Button>
			<Drawer
				visible={open}
				width={'100vw'}
				title={<Pagination current={currentPage} onChange={handleChangePage} total={questions.length} />}
				extra={'Aqui va el Quórum'}
				onClose={handleClose}
				destroyOnClose>
				<Row gutter={[16, 16]} style={{ height: 'calc(100vh - 125px)' }}>
					<Col style={{ height: '100%' }} span={12}>
						<Row style={{ height: '100%' }} gutter={[16, 16]}>
							<GraphicSection graphicsData={graphicsData} id={survey.id} />
						</Row>
					</Col>
					<Col style={{ height: '100%' }} span={12}>
						<Row style={{ height: '100%' }} gutter={[16, 16]}>
							<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
								<PercentageSection graphicsData={graphicsData} />
							</Col>
							<Col style={{ height: 'calc(50% - 10px)' }} span={24}>
								<ParticipationSection graphicsData={graphicsData} />
							</Col>
						</Row>
					</Col>
				</Row>
			</Drawer>
		</>
	);
}
