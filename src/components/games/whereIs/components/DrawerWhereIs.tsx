import { Button, Drawer, Grid, Typography } from 'antd';
import { ReactNode, useState } from 'react';

interface Props {
	children: React.ReactNode;
	lifes: ReactNode;
	footer?: ReactNode;
}

const { useBreakpoint } = Grid;

export default function DrawerWhereIs(props: Props) {
	const { lifes, footer } = props;
	const screens = useBreakpoint();
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
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
				// title='¿Y dónde se encuentra?'
				visible={open}
				bodyStyle={{
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
					backgroundSize: 'cover',
					paddingLeft: screens.xs ? '5px' : '24px',
					paddingRight: screens.xs ? '5px' : '24px',
				}}
				extra={lifes}
				footer={footer}
				onClose={handleClose}
				width='100vw'
				destroyOnClose={true}>
				{props.children}
			</Drawer>
		</>
	);
}
