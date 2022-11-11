import { Button, Card, Col, Form, Image, Input, Row } from 'antd';
import { useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import SendIcon from '@2fd/ant-design-icons/lib/Send';
import Loading from '@/components/profile/loading';

export default function CreatePost() {
	const [title, setTitle] = useState<string>('');
	const { goTo, imageUploaded, setImageUploaded } = useSharePhotoInLanding();
	const { createPost, loading } = useSharePhoto();

	const handleFinish = async () => {
		if (imageUploaded) {
			const newPost = {
				image: imageUploaded,
				title,
			};
			await createPost(newPost);
			setImageUploaded(null);
			goTo('galery');
		}
	};

	if (!imageUploaded) return <p>No has subido o tomado una foto aun</p>;

	if (loading) return <Loading />;

	return (
		<>
			<Row gutter={[0, 0]} justify='center' align='middle' style={{ height: '100%' }}>
				<Col xs={24} style={{ display: 'grid', placeContent: 'center' }}>
					<Card
						style={{ maxWidth: '450px' }}
						cover={<Image style={{ filter: 'brightness(70%) blur(2px)' }} preview={false} src={imageUploaded} />}
						bordered={false}
						bodyStyle={{ padding: '10px' }}>
						<Form
							style={{
								position: 'absolute',
								bottom: '1%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: '330px',
							}}
							onFinish={handleFinish}>
							<Form.Item required>
								<Input.Group compact>
									<Input
										style={{ width: '88%' }}
										size='large'
										value={title}
										onChange={e => setTitle(e.target.value)}
										placeholder='Ponle un titulo'
									/>
									<Button
										icon={<SendIcon style={{ color: '#FFFFFF' }} />}
										size='large'
										type='text'
										style={{ backgroundColor: '#52C41A' }}
										htmlType='submit'
									/>
								</Input.Group>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</>
	);
}
