import { HeartFilled } from '@ant-design/icons';
import { Button, Card, Col, Image, Row } from 'antd';
import { useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import { Post } from '../../types';

const { Meta } = Card;

export default function Galery() {
	const { goTo } = useSharePhotoInLanding();
	const { sharePhoto } = useSharePhoto();
	const [postSelected, setPostSelected] = useState<Post | null>(null);

	const handleBack = () => {
		if (postSelected !== null) {
			setPostSelected(null);
		} else {
			goTo('chooseAction');
		}
	};
	return (
		<>
			<Row gutter={[12, 12]}>
				<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={handleBack}>Atras</Button>
				</Col>
			</Row>
			<Row gutter={[12, 12]} style={{ marginTop: 10 }}>
				<Col xs={24}>
					<Card
						style={{ maxHeight: '60vh', display: postSelected ? 'block' : 'none', margin: 'auto' }}
						cover={<Image src={postSelected?.image} preview={false} />}>
						<Meta
							avatar={
								<Button
									size='large'
									style={{ width: '100%', height: '100%', padding: 2, margin: 2, border: 'none' }}
									danger
									ghost
									icon={<HeartFilled style={{ fontSize: '40px' }} />}
								/>
							}
							title={'Author'}
							description={postSelected?.title}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={[12, 12]} style={{ display: postSelected ? 'none' : 'block' }}>
				<Col style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
					<Card>
						<Row>
							{sharePhoto?.posts.map(post => (
								<Col key={post.id} xs={8} md={6}>
									<Card
										style={{
											borderColor: 'black',
											aspectRatio: '1 / 1',
											overflow: 'hidden',
										}}
										bodyStyle={{ padding: 0 }}>
										<Image
											src={post.thumb}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
											onClick={() => setPostSelected(post)}
											preview={false}
										/>
									</Card>
								</Col>
							))}
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
}
