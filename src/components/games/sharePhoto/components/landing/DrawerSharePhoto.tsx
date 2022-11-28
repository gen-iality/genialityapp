import { Button, Drawer, Grid, Space } from 'antd';
import { useEffect, useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import DrawerRanking from '../../views/landing/DrawerRanking';
import GoBack from '../GoBack';
import RankingDrawer from './RankingDrawer';

interface Props {
	children: React.ReactNode;
}

const { useBreakpoint } = Grid;

export default function DrawerSharePhoto(props: Props) {
	const [open, setOpen] = useState(false);
	const { sharePhoto } = useSharePhoto();
	const screens = useBreakpoint();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		// if (sharePhoto !== null) {
		// 	const unSubscribe = listenSharePhoto();
		// 	return () => unSubscribe();
		// }
	}, [sharePhoto]);

	if (!sharePhoto) return null;

	return (
		<>
			<Button
				size='large'
				type='primary'
				onClick={handleOpen}
				style={{ display: sharePhoto?.published ? 'block' : 'none' }}>
				Comparte tu foto
			</Button>
			<Drawer
				title={<RankingDrawer />}
				extra={<GoBack />}
				visible={open}
				bodyStyle={{
					// backgroundImage: `url(${cEvent.value?.styles?.BackgroundImage})`,
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
					backgroundSize: 'cover',
					paddingLeft: screens.xs ? '5px' : '24px',
					paddingRight: screens.xs ? '5px' : '24px',
				}}
				onClose={handleClose}
				width='100vw'
				destroyOnClose={true}>
				{sharePhoto.active ? props.children : <p>Esta dinamica no esta activa aun</p>}
			</Drawer>
		</>
	);
}
