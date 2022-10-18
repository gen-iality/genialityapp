import { Button, Drawer, Grid } from 'antd';
import { useState } from 'react';

interface Props {
	children: React.ReactNode;
}

const { useBreakpoint } = Grid;

export default function DrawerSharePhoto(props: Props) {
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
				¡Comparte tu foto 📷!
			</Button>
			<Drawer
				title='¡Comparte tu foto 📷!'
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
				{props.children}
			</Drawer>
		</>
	);
}
