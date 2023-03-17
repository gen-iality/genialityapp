import { EventsApi } from '@/helpers/request';
import { Form, Switch } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
	eventId: string;
	initialState: boolean | null;
}

export default function LandingRedirectForm(props: Props) {
	const [redirectLanding, setRedirectLanding] = useState(false);

	const handleChange = async (checked: boolean) => {
    setRedirectLanding(checked)
		await EventsApi.editOne({ redirect_landing: checked }, props.eventId);
	};

	useEffect(() => {
		if (!!props.initialState) {
			setRedirectLanding(props.initialState || false);
		}
	}, []);

	return (
		<Form.Item
			label={
				<label style={{ marginTop: '2%' }}>
					Redirigir al evento si ya estas registrado
				</label>
			}
			// rules={[{ required: true, message: 'El nombre es requerido' }]}
		>
			<Switch onChange={handleChange} checked={redirectLanding} />
		</Form.Item>
	);
}
