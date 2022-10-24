import { Card, Form, Input } from 'antd';
import Header from '@/antdComponents/Header';
import useSharePhoto from '../hooks/useSharePhoto';

interface Props {
	eventId: string;
}

export default function CreateSharePhoto(props: Props) {
  const { eventId } = props;
	const { createSharePhoto } = useSharePhoto();

	const handleFinish = (values: { title: string }) => {
		createSharePhoto({
			event_id: eventId,
			title: values.title,
		});
	};

	return (
		<Form onFinish={handleFinish}>
			<Header
				title={'Dinamica Comparte tu Foto 📷'}
				description={''}
				back
				form
				save={true}
			/>
			<Card style={{ marginTop: 12 }}>
				<Form.Item
					label={<label>Nombre de la dinamica</label>}
					name='title'
					rules={[{ required: true, message: 'El nombre es requerido' }]}>
					<Input placeholder={'Mi dinamica'} />
				</Form.Item>
			</Card>
		</Form>
	);
}
