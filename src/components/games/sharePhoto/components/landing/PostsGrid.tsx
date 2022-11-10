import { HeartFilled } from '@ant-design/icons';
import { Col, Image, Row, Space } from 'antd';
import React from 'react';
import { Post } from '../../types';

interface Props {
	posts: Post[];
	overlay: any;
	setOverlay: any;
	setPostSelected: any;
}

export default function PostsGrid(props: Props) {
	const { posts, overlay, setOverlay, setPostSelected } = props;
	return (
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
	);
}
