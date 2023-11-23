import React, { useState } from 'react';
import { Drawer, List, Avatar, Button, Typography, Tooltip } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import FlagVariantIcon from '@2fd/ant-design-icons/lib/FlagVariant';
import { CloseOutlined } from '@ant-design/icons';
import ProgressStarIcon from '@2fd/ant-design-icons/lib/ProgressStar';
import { getCorrectColor } from '@/helpers/utils';

export default function Stages() {
	const { stages, currentStage, stage, statusGame, millonaire } = useMillonaireLanding();
	const [isVisible, setIsVisible] = useState(false);
	const stagesOrderByStage = stages.sort((a, b) => b.stage - a.stage);
	const backgroundMillonaire = millonaire.appearance.background_color || '#120754';
	const primaryMillonaire = millonaire.appearance.primary_color || '#FFB500';

	return (
		<>
			<Button
				block
				type={statusGame === 'STARTED' ? 'primary' : 'default'}
				size='large'
				shape={statusGame === 'STARTED' ? 'round' : 'default'}
				style={
					statusGame === 'STARTED'
						? {
								background: `radial-gradient(129.07% 129.07% at 50% 56.98%, ${backgroundMillonaire} 0%, ${backgroundMillonaire} 100%)`,
								borderColor: getCorrectColor(backgroundMillonaire),
						  }
						: { backgroundColor: backgroundMillonaire, color:getCorrectColor(backgroundMillonaire), border:'none' }
				}
				onClick={() => setIsVisible(!isVisible)}>
				{statusGame === 'ANNOUNCEMENT' || statusGame === 'STARTED' ? (
					'Etapas'
				) : (
					<Typography.Text style={{ color: getCorrectColor(backgroundMillonaire) }} strong>
						Etapas
					</Typography.Text>
				)}
			</Button>
			<Drawer
				className='editAnt'
				closeIcon={<CloseOutlined style={{ color: '#FFFFFF' }} />}
				headerStyle={{
					border: 'none',
					backgroundColor: backgroundMillonaire,
				}}
				bodyStyle={{ backgroundColor: backgroundMillonaire }}
				visible={isVisible}
				onClose={() => setIsVisible(!isVisible)}>
				<List
					bordered={false}
					split={false}
					itemLayout='horizontal'
					dataSource={stagesOrderByStage}
					renderItem={(stage) => (
						<List.Item
							style={{
								borderRadius: '10px',
								padding: '8px 10px',
								backgroundColor: currentStage.stage === stage.stage ? primaryMillonaire : '',
								color: getCorrectColor(primaryMillonaire),
							}}
							extra={
								stage.lifeSaver && (
									<Tooltip title='Seguro'>
										<FlagVariantIcon
											style={{
												fontSize: '25px',
												color: currentStage.stage === stage.stage ? backgroundMillonaire : primaryMillonaire,
											}}
										/>
									</Tooltip>
								)
							}>
							<List.Item.Meta
								avatar={
									<Avatar
										style={{
											backgroundColor: currentStage.stage === stage.stage ? backgroundMillonaire : primaryMillonaire,
											color: currentStage.stage === stage.stage ? primaryMillonaire : backgroundMillonaire,
											fontWeight: 'bold',
										}}>
										{stage.stage}
									</Avatar>
								}
								title={
									<Typography.Text
										strong
										style={{
											color: currentStage.stage === stage.stage ? backgroundMillonaire : '#FFFFFF',
											fontSize: '18px',
										}}>
										<ProgressStarIcon style={{ fontSize: '20px' }} /> {stage.score}
									</Typography.Text>
								}
							/>
						</List.Item>
					)}
				/>
			</Drawer>
		</>
	);
}
