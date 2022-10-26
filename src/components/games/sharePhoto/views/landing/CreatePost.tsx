import { Button, Card, Col, Form, Image, Input, Row } from 'antd';
import { useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function CreatePost() {
	const [title, setTitle] = useState<string>('');
	const { goTo, imageUploaded } = useSharePhotoInLanding();
	const { createPost } = useSharePhoto();

	const handleFinish = async () => {
		if (imageUploaded) {
			const newPost = {
				image: imageUploaded,
				thumb: imageUploaded,
				title,
			};
			await createPost(newPost);
			goTo('galery');
		}
	};

	if (!imageUploaded) return <p>No has subido o tomado una foto aun</p>;

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={() => goTo('chooseAction')}>Atras</Button>
			</Col>
			<Col xs={24} style={{ display: 'grid', placeContent: 'center' }}>
				<Card bodyStyle={{ position: 'relative' }}>
					<Form onFinish={handleFinish}>
						<Image preview={false} src={imageUploaded} style={{ maxHeight: '50vh' }} />
						<Card
							style={{
								width: '100%',
								border: 'none',
								padding: 0,
								margin: 0,
							}}
							bodyStyle={{
								padding: 0,
								paddingTop: 10,
							}}
						>
							<Form.Item>
								<Input value={title} onChange={e => setTitle(e.target.value)} placeholder='Ponle un titulo' />
							</Form.Item>
							<Button
								type='primary'
								style={{ width: '100%', marginTop: 0 }}
								htmlType='submit'
							>
								Enviar
							</Button>
						</Card>
					</Form>
				</Card>
			</Col>
		</Row>
	);
}
