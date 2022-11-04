import { Button, Drawer, Grid, Typography } from 'antd';
import { ReactNode, useState } from 'react';
import useWhereIsInLanding from '../hooks/useWhereIsInLanding';
import FooterWithHints from './landing/FooterWithHints';
import Lifes from './landing/Lifes';
import Timer from './landing/Timer';

interface Props {
	children: ReactNode;
}

const { useBreakpoint } = Grid;

export default function DrawerWhereIs(props: Props) {
	const screens = useBreakpoint();
	const [open, setOpen] = useState(false);
	const { goTo, location } = useWhereIsInLanding();

	const handleOpen = () => {
		setOpen(true);
		goTo('introduction');
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button size='large' type='primary' onClick={handleOpen}>
				¿Y dónde se encuentra?
			</Button>
			<Drawer
				visible={open}
				bodyStyle={{
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
					backgroundSize: 'cover',
					paddingLeft: screens.xs ? '5px' : '24px',
					paddingRight: screens.xs ? '5px' : '24px',
				}}
				headerStyle={{
					padding: 12,
				}}
				extra={
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
						<Timer />
						<Lifes />
					</div>
				}
				footer={location.activeView === 'game' ? <FooterWithHints /> : undefined}
				onClose={handleClose}
				width='100vw'
				destroyOnClose={true}>
				{props.children}
			</Drawer>
		</>
	);
}
