import { Card } from 'antd';
import { useEffect, useState } from 'react';
// import ChartRender from '@/components/events/surveys/ChartRender';
import { GraphicsData } from '@/components/events/surveys/types';
import ChartRender from '../ChartRender';
import useAssemblyInCMS from '../../hooks/useAssemblyInCMS';
import { Survey } from '../../types';

interface Props {
	survey: Survey;
	questionSelectedId: string;
	graphicsData: GraphicsData;
}

export default function GraphicSection(props: Props) {
	const { survey, questionSelectedId, graphicsData } = props;
	// const { survey, questionSelectedId } = props;
	// const { listenAnswersQuestion } = useAssemblyInCMS();
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('pie');
	// const [graphicsData, setGraphicsData] = useState<GraphicsData>({
	// 	dataValues: [],
	// 	labels: [],
	// 	labelsToShow: [],
	// });
	// // console.log('graphicsData', graphicsData);

	// useEffect(() => {
	// 	const unsubscribe = listenAnswersQuestion(survey.id, questionSelectedId, setGraphicsData);
	// 	return () => unsubscribe();
	// }, []);

	// useEffect(() => {
	// 	console.log('AssemblyGraphicsDrawer: questions', survey.id, survey.name, graphicsData);
	// }, [graphicsData]);

	return (
		<Card style={{ height: '100%', width: '100%' }}>
			<ChartRender
				// id={id}
				dataValues={graphicsData.dataValues}
				isMobile={false}
				labels={graphicsData.labelsToShow}
				type={graphicType}
			/>
		</Card>
	);
}
