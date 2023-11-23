import React from 'react';
import { Space, Button, Row, Modal } from 'antd';
import Stages from './Stages';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import ExitRunIcon from '@2fd/ant-design-icons/lib/ExitRun';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ButtonMillonaire } from '../interfaces/Millonaire';
import { getCorrectColor } from '@/helpers/utils';
const { confirm } = Modal;

export default function WildCards({ isTitle }: ButtonMillonaire) {
	const {
		onFinishedGame,
		usedWildCards,
		onFiftyOverFifty,
		statusGame,
		stages,
		prevScore,
		currentStage,
		millonaire,
	} = useMillonaireLanding();
	const { used50 } = usedWildCards;
	const backgroundMillonaire = millonaire.appearance.background_color || '#120754';
	const primaryMillonaire = millonaire.appearance.primary_color || '#FFB500';
	const showPropsConfirm = () => {
		confirm({
			centered: true,
			title: '¿Está seguro que desea retirarse?',
			icon: <ExclamationCircleOutlined />,
			// content: 'Su puntaje final será el de la última etapa superada',
			content: `Su puntaje final será de ${currentStage.stage === 1 ? 0 : prevScore} puntos`,
			okText: 'Retirarme',
			okType: 'danger',
			cancelText: 'Seguir jugando',
			onOk() {
				onFinishedGame();
			},
		});
	};

	return (
		<Row justify='center' align='middle'>
			<Space wrap>
				{!isTitle && (
					<Button
						disabled={used50}
						type='primary'
						size='large'
						shape='round'
						style={{
							background: `radial-gradient(129.07% 129.07% at 50% 56.98%, ${backgroundMillonaire} 0%, ${backgroundMillonaire} 100%)`,
							borderColor: getCorrectColor(backgroundMillonaire),
						}}
						onClick={() => onFiftyOverFifty()}>
						50 / 50
					</Button>
				)}
				{isTitle && (
					<Button
						type='primary'
						size='large'
						shape='round'
						style={{
							background: `radial-gradient(129.07% 129.07% at 50% 56.98%, ${primaryMillonaire} 0%, ${primaryMillonaire} 100%)`,
							border:'none'
						}}
						onClick={() => showPropsConfirm()}>
						{/* <ExitRunIcon style={{ fontSize: '25px' }} /> */}
						{currentStage.stage === 1 && 'Retirarme'}
						{currentStage && currentStage.stage !== 1 && 'Retirarme con' + ' ' + prevScore + ' ' + 'puntos'}
					</Button>
				)}
				{!isTitle && <Stages />}
			</Space>
		</Row>
	);
}
