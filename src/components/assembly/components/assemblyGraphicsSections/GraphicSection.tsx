import { Card } from 'antd';
import { useState } from 'react';
import ChartRender from '@/components/events/surveys/ChartRender';
import { GraphicsData } from '@/components/events/surveys/types';

interface Props {
	id: string;
	graphicsData: GraphicsData;
}

export default function GraphicSection(props: Props) {
	const { graphicsData, id } = props;
	const [graphicType, setGraphicType] = useState<'horizontal' | 'vertical' | 'pie'>('pie');
	console.log('graphicsData', graphicsData);
	return (
		<Card style={{ height: '100%', width: '100%' }}>
			{!!graphicsData.dataValues.length && (
				<ChartRender
					id={id}
					dataValues={graphicsData.dataValues}
					isMobile={false}
					labels={graphicsData.labelsToShow}
					type={graphicType}
				/>
			)}
		</Card>
	);
}
