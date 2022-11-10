import { HeartFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Drawer, Grid, Image, Input, PageHeader, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PostDrawer from '../../components/landing/PostDrawer';
import PostsGrid from '../../components/landing/PostsGrid';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import { Post } from '../../types';

const { Meta } = Card;
const { useBreakpoint } = Grid;

export default function Gallery() {
	const { goTo } = useSharePhotoInLanding();
	const {
		postsListener,
		postSelected,
		setPostSelected,
		addLike,
		posts,
		getPostByTitle,
		filteredPosts,
	} = useSharePhoto();
	const [overlay, setOverlay] = useState('');
	const [postsToShow, setPostsToShow] = useState<'all' | 'filtered'>('all');

	const screens = useBreakpoint();

	const handleBack = () => {
		if (postSelected !== null) {
			setPostSelected(null);
		} else {
			goTo('chooseAction');
		}
	};

	const handlerSearch = (
		value: string,
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.MouseEvent<HTMLElement, MouseEvent>
			| React.KeyboardEvent<HTMLInputElement>
			| undefined
	) => {
		console.log(value);

		if (value.length) {
			setPostsToShow('filtered');
			getPostByTitle(value);
		} else {
			setPostsToShow('all');
		}
	};

	const handlerDoubleClick = (id: string) => {
		addLike(id);
	};

	useEffect(() => {
		// Here goes the listener
		const unsubscribe = postsListener();
		return () => unsubscribe();
	}, []);
	return (
		<>
			{postSelected && <PostDrawer postSelected={postSelected} addLike={addLike} handleBack={handleBack} />}
			<Row align='middle' justify='center'>
				<Input.Search
					style={{ marginBottom: '20px', width: screens.xs ? '80vw' : '40vw', border: 'none' }}
					placeholder='Buscar publicación'
					allowClear
					enterButton={<SearchOutlined />}
					size='large'
					onSearch={handlerSearch}
				/>
			</Row>
			<PostsGrid
				posts={postsToShow === 'filtered' ? filteredPosts : posts}
				overlay={overlay}
				setOverlay={setOverlay}
				setPostSelected={setPostSelected}
			/>
		</>
	);
}
