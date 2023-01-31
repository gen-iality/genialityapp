import { Card, Row, Grid, Segmented, Result, Typography } from 'antd';
// import { useEffect, useState } from 'react';
// import ChartRender from '@/components/events/surveys/ChartRender';
import { GraphicsData } from '@/components/events/surveys/types';
import ChartRender from '../ChartRender';
// import useAssemblyInCMS from '../../hooks/useAssemblyInCMS';
import { GraphicType, Question, Survey } from '../../types';
import { useState } from 'react';
import { SegmentedValue } from 'antd/lib/segmented';
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';

interface Props {
	survey: Survey;
	questionSelectedId: string;
	graphicsData: GraphicsData;
	graphicType: GraphicType;
	question: Question;
	// setGraphicType: React.Dispatch<React.SetStateAction<GraphicType>>;
}

const { useBreakpoint } = Grid;

export default function GraphicSection(props: Props) {
	// const { survey, questionSelectedId, graphicsData, graphicType, setGraphicType } = props;
	const { survey, questionSelectedId, graphicsData, graphicType, question } = props;
	// console.log(survey)
	// const { survey, questionSelectedId } = props;
	// const { listenAnswersQuestion } = useAssemblyInCMS();
	// const [value, setValue] = useState<GraphicType>('pie');
	// const [graphicType, setGraphicType] = useState<GraphicType>('pie');
	const screens = useBreakpoint();

	// const handleGraphicType = (value: SegmentedValue) => {
	// 	console.log(value);
	// 	setGraphicType(value as GraphicType);
	// };
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
	// console.log({ graphicType });

	return (
		<Card style={{ height: '100%', width: '100%' }} headStyle={{ border: 'none' }}
		bodyStyle={{ paddingTop: '0px' }}
		title={<div className='animate__animated animate__fadeInLeft' key={question?.title}> {question?.title} </div>}>
			<Row align='middle' justify='center'>
				{/* @ts-ignore */}
				{/* <Segmented
					// title='Tipo de grafica'
					options={[
						{ value: 'pie', icon: <PieChartOutlined /> },
						{ value: 'horizontal', icon: <BarChartOutlined rotate={90} /> },
						{ value: 'vertical', icon: <BarChartOutlined /> },
					]}
					value={graphicType as string}
					// onChange={handleGraphicType}
				/> */}
				{/* {question?.title && <Typography.Text style={{fontSize:'18px', fontWeight:'700'}}>{question?.title}</Typography.Text>} */}
				{!graphicsData.dataValues?.length && <Result title='No hay graficas para mostrar aun'></Result>}
				<div style={{ visibility: !graphicsData.dataValues?.length ? 'hidden' : 'visible', height:'100%', width:'100%', display:'flex', alignItems: 'center', justifyContent: 'center' }}>
					<ChartRender
						// id={id}
						dataValues={graphicsData.dataValues}
						isMobile={screens.xs ? true : false}
						labels={graphicsData.labelsToShow}
						type={graphicType}
					/>
				</div>
			</Row>
		</Card>
	);
}
