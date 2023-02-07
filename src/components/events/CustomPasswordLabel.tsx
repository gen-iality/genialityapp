import { Form, Input, Switch } from 'antd';
import React, { useState } from 'react';

interface Props {
	isCustomPasswordLabel: boolean;
	customPasswordLabel: string;
	handleChangeCustomPassword: (isCustomPasswordLabel: boolean, customPasswordLabel: string) => void;
}

export default function CustomPasswordLabel(props: Props) {
	const { isCustomPasswordLabel, customPasswordLabel, handleChangeCustomPassword } = props;
	// const [isCustomPasswordLabel, setIsCustomPasswordLabel] = useState(initialState ?? false);
	// const [customPasswordLabel, setCustomPasswordLabel] = useState('contraseña');
	// console.log({ isCustomPasswordLabel, customPasswordLabel });

	const handleChangeSwitch = (checked: boolean) => {
		// setIsCustomPasswordLabel(checked);
		handleChangeCustomPassword(checked, customPasswordLabel);
	};

	const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setCustomPasswordLabel(event.target.value);
		handleChangeCustomPassword(isCustomPasswordLabel, event.target.value);
	};

	return (
		<>
			<Form.Item tooltip='Remplazar el texto de "Contraseña" por el de su preferencia.' label='Personalizar campo de contraseña'>
				<Switch onChange={handleChangeSwitch} checked={isCustomPasswordLabel} />
			</Form.Item>
			{isCustomPasswordLabel && (
				<Form.Item tooltip='El nombre asignado será visible en el inicio de sesión y registro dentro del evento.' label='Texto de campo de contraseña'>
					<Input placeholder='Ej. Contraseña' showCount maxLength={25} onChange={handleChangeInput} value={customPasswordLabel} />
				</Form.Item>
			)}
		</>
	);
}