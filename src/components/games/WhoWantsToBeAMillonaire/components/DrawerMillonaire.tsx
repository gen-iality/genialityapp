import { Row, Button, Drawer, Typography } from 'antd';
import MenuGame from './MenuGame';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import WildCards from './WildCards';
import React from 'react';
import Millonaire from './Millonaire';
import GameStartAnnoucement from './GameStartAnnoucement';
import { IRenderViewLanding } from '../interfaces/Millonaire';
import Ranking from '../../common/Ranking';
import UsersRanking from './UsersRanking';
import { CloseOutlined } from '@ant-design/icons';
import Stages from './Stages';
import GameAnnoucement from './GameAnnoucement';
import { getCorrectColor } from '@/helpers/utils';

export default function DrawerMillonaire() {
	const {
		isVisible,
		visibilityControl,
		statusGame,
		onChangeVisibilityDrawer,
		millonaire,
		startGame,
	} = useMillonaireLanding();
	const RenderView: IRenderViewLanding = {
		NOT_STARTED: <MenuGame />,
		STARTED: <Millonaire />,
		GAME_OVER: <UsersRanking />,
		ANNOUNCEMENT: <GameStartAnnoucement />,
	};

	const backgroundMillonaire = millonaire.appearance.background_color || '#120754'

	return (
		<>
			{!!visibilityControl && visibilityControl?.published && (
				<Row align='middle' justify='center' style={{ padding: '10px' }}>
					<Button size='large' type='primary' disabled={!visibilityControl.active} onClick={onChangeVisibilityDrawer}>
						¡Jugar Millonario!
					</Button>
				</Row>
			)}
			<Drawer
				closeIcon={<CloseOutlined style={{ color: getCorrectColor(backgroundMillonaire) }} />}
				headerStyle={{
					border: 'none',
					background: backgroundMillonaire,
				}}
				bodyStyle={{
					padding: '0px',
					background: backgroundMillonaire ,
					/* backgroundImage: `url(${millonaire.appearance?.background_image})`, */
				}}
				footerStyle={{
					border: 'none',
					background: backgroundMillonaire,
				}}
				width={'100vw'}
				onClose={onChangeVisibilityDrawer}
				title={statusGame === 'STARTED' && <WildCards isTitle={true} />}
				footer={statusGame === 'STARTED' && <WildCards />}
				visible={isVisible}>
				{RenderView[statusGame as keyof IRenderViewLanding] || <GameAnnoucement />}
			</Drawer>
		</>
	);
}
