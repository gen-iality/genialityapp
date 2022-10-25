import { Button, ButtonProps, Typography } from 'antd';
import { ReactNode } from 'react';

interface Props extends ButtonProps {
	icon: ReactNode;
	label: string;
}

export default function ChooseButton(props: Props) {
	const { icon, label, ...rest } = props;
	return (
		<Button
			style={{ height: '150px', width: '150px', margin: '0 auto' }}
			icon={
				<>
					{icon}
					<Typography style={{ marginTop: '5px' }}>{label}</Typography>
				</>
			}
			{...rest}
		/>
	);
}
