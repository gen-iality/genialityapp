import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Drawer, Grid, Image, Input, PageHeader, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import { Post } from '../../types';

const { Meta } = Card;
const { useBreakpoint } = Grid;

export default function Gallery() {
	const { goTo } = useSharePhotoInLanding();
	const { sharePhoto, addLike, posts } = useSharePhoto();
	const [postSelected, setPostSelected] = useState<Post | null>(null);
	const [overlay, setOverlay] = useState('');

	const screens = useBreakpoint();

	const handleBack = () => {
		if (postSelected !== null) {
			setPostSelected(null);
		} else {
			goTo('chooseAction');
		}
	};

	const handlerDoubleClick = (id: string) => {
		addLike(id);
	};

	useEffect(() => {
		// Here goes the listener
		// return () => unsubscribe();
	}, []);
	return (
		<>
			{postSelected && (
				<Drawer
					bodyStyle={{ padding: screens.xs ? '0px' : '0' }}
					width={screens.xs ? '100vw' : '35vw'}
					visible={postSelected ? true : false}
					onClose={() => handleBack()}
					title={''}
					extra={
						<PageHeader
							style={{ padding: '0px 0px' }}
							avatar={{ icon: <UserOutlined />, src: postSelected.picture }}
							title={
								<Typography.Text type='secondary' style={{ fontSize: screens.xs ? '16px' : '18px' }}>
									{postSelected.user_name}
								</Typography.Text>
							}
							/* children={<Typography.Title level={4}>{postSelected.title}</Typography.Title>} */
						/>
					}
					footerStyle={{ border: 'none' }}
					footer={
						<Space>
							<Button
								size='large'
								style={{ width: '100%', height: '100%', padding: 2, margin: 2, border: 'none' }}
								danger
								ghost
								// onClick={() => console.log('postId', postSelected?.id)}
								onClick={() => addLike(postSelected.id)}
								icon={<HeartFilled style={{ fontSize: '35px' }} />}
							/>
							<Badge
								overflowCount={99999}
								style={{
									fontSize: '28px',
									height: 'auto',
									width: 'auto',
									color: '#000000',
									backgroundColor: 'transparent',
								}}
								count={/* postSelected.likes.length*/ 12}></Badge>
						</Space>
					}>
					<Row gutter={[0, 0]}>
						<Col span={24}>
							<Card
								style={{ width: '100%' }}
								bodyStyle={{ padding: '10px 10px' }}
								bordered={false}
								cover={
									<div
										style={{
											backgroundImage: `url(${postSelected.image})`,
											backgroundRepeat: 'no-repeat',
											backgroundSize: 'cover',
											backgroundPosition: 'center',
										}}>
										<Image
											/*  onDoubleClick={() => handlerDoubleClick(postSelected.id)} */
											width={'100%'}
											style={{
												minHeight: '420px',
												objectFit: screens.xs ? 'contain' : 'unset',
												backgroundColor: '#00000033',
												backdropFilter: 'blur(8px)',
											}}
											src={postSelected.image}
											preview={false}
										/>
									</div>
								}>
								<Typography.Title level={5}>{postSelected.title}</Typography.Title>
							</Card>
						</Col>
					</Row>
				</Drawer>
			)}
			{/* ==================================================================================
                                             GALLERY
          ==================================================================================
      */}
			<Row align='middle' justify='center'>
				<Col>
					<Row align='middle' justify='center'>
						<Input.Search
							style={{ marginBottom: '20px' }}
							placeholder='input search text'
							allowClear
							enterButton='Search'
							size='large'
							onSearch={console.log}
						/>
					</Row>
				</Col>
			</Row>
			<Row gutter={[0, 0]}>
				{posts.map(post => (
					<Col
						key={post.id}
						onClick={() => setPostSelected(post)}
						onMouseEnter={() => setOverlay(post.id)}
						onMouseLeave={() => setOverlay('')}
						xs={8}
						sm={8}
						md={6}
						lg={4}
						xl={4}
						xxl={4}
						style={{
							/* backgroundImage: `url(${post.thumb || 'https://via.placeholder.com/500/?text=Error'})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              scrollSnapAlign: 'center',
              backgroundPosition: 'center', */
							height: '100%',
							aspectRatio: '4/4',
							padding: '0px',
						}}>
						<Image
							preview={false}
							height={'100%'}
							width={'100%'}
							style={{ objectFit: 'cover', position: 'absolute', top: '0' }}
							src={post.thumb}
							fallback={'https://via.placeholder.com/500/?text=Image not found!'}
							placeholder={
								<Image
									preview={false}
									height={'100%'}
									width={'100%'}
									src={'https://via.placeholder.com/800/000000/FFFFFF/?text=Cargando'}
								/>
							}
						/>
						<div
							style={{
								width: '100%',
								height: '100%',
								backgroundColor: '#0000004d',
								backdropFilter: 'blur(2px)',
								display: `${overlay === post.id ? 'block' : 'none'}`,
								cursor: 'pointer',
								position: 'absolute',
								top: '0',
							}}>
							<Row justify='center' align='middle' style={{ height: '100%' }}>
								<Space style={{ fontSize: '20px', color: '#FFFFFF' }}>
									<HeartFilled />
									{post.likes}
								</Space>
							</Row>
						</div>
					</Col>
				))}
			</Row>
		</>
	);
}
