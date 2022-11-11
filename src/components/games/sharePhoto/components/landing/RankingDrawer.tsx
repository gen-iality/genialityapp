import Ranking from '@/components/games/common/Ranking';
import { Button, Drawer, Grid, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import { isMobile } from 'react-device-detect';
import { Score } from '@/components/games/common/Ranking/types';
import { UseUserEvent } from '@/context/eventUserContext';

// const myScore = {
//   uid: '636c0c6d96121d4a4e3995a4',
//   imageProfile:
//     'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
//   score: '100',
//   name: 'Juan Camayo',
//   index: 1,
// };

// const scores = [
//   {
//     uid: '636c0c6d96121d4a4e3995a4',
//     imageProfile:
//       'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
//     score: '100',
//     name: 'Juan Camayo',
//     index: 1,
//   },
//   {
//     uid: '636bb6b521b48d56a8144709',
//     imageProfile:
//       'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
//     score: '50',
//     name: 'Juan Camayo',
//     index: 2,
//   },
// ];

const type: 'time' | 'points' = 'points';
const { useBreakpoint } = Grid;
export default function RankingDrawer() {
	const [open, setOpen] = useState(false);
	const { scores, rankingListener } = useSharePhoto();
	const [myScore, setMyScore] = useState<Score | null>(null);
	const screens = useBreakpoint();
	const cUser = UseUserEvent();
	useEffect(() => {
		const unsubscribe = rankingListener();
		return () => unsubscribe();
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeviceOrientation = () => {
		const deviceOrientation = window.screen.orientation.type;
		switch (deviceOrientation) {
			case 'landscape-primary':
			case 'landscape-secondary':
				return 'HORIZONTAL';
			case 'portrait-primary':
			case 'portrait-secondary':
				return 'VERTICAL';
			default:
				return 'VERTICAL';
		}
	};

	useEffect(() => {
		const myScore = scores.find(score => score.uid === cUser.value._id);
		if (myScore) {
			setMyScore(myScore);
		} else {
			setMyScore(null);
		}
	}, [scores]);

	return (
		<Space>
			<Button type='primary' onClick={handleOpen}>
				Ver Ranking
			</Button>
			<Drawer
				title='Ranking'
				bodyStyle={{ padding: screens.xs ? '10px' : '24px', backgroundColor: '#F1F1F1' }}
				width={
					screens.xs && handleDeviceOrientation() === 'VERTICAL'
						? '100vw'
						: !screens.lg && !screens.xl && handleDeviceOrientation() === 'HORIZONTAL'
						? '60vw'
						: '35vw'
				}
				visible={open}
				onClose={handleClose}>
				<Ranking scores={scores} myScore={myScore ?? undefined} withMyScore={true} type='points' />
			</Drawer>
		</Space>
	);
}
