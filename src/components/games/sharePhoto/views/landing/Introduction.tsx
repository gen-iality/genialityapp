import { CameraOutlined, TableOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Typography } from 'antd';
import React, { useState } from 'react';
import ChooseButton from '../../components/ChooseButton';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

interface TematicCardWithImageProps {
	content: {
		type: 'image' | 'text' | string;
		content: string;
	};
}

const TematicCardWithImage = (props: TematicCardWithImageProps) => {
	const { content } = props;
	return (
		<Card
			title={'Tematica'}
			style={{ width: '100%' }}
			bodyStyle={{
				display: 'flex',
				justifyContent: 'center',
				margin: 0,
				padding: 0,
			}}
			headStyle={{ textAlign: 'center' }}>
			{content.type === 'text' && <Typography>{content.content}</Typography>}
			{content.type === 'image' && (
				<Image
					preview={false}
					src={content.content}
					alt=''
					// style={{ objectFit: 'cover' }}
				/>
			)}
		</Card>
	);
};

export default function Introduction() {
	const { sharePhoto } = useSharePhoto();
  const { goTo  } = useSharePhotoInLanding()

	if (!sharePhoto) {
		return <p>Ups! esta dinamica no existe aun!</p>;
	}

	return (
		<Row gutter={[12, 12]}>
			{/* <Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button>Atras</Button>
				<Button>Siguiente</Button>
			</Col> */}
			<Col xs={24}>
				<Card title='Instrucciones' headStyle={{ textAlign: 'center' }}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
					aliquam veniam magni assumenda, illo hic facere optio natus cupiditate
					impedit exercitationem nostrum autem nam eum reiciendis id neque atque
					ab. Atque quaerat corporis, omnis alias asperiores iure laudantium.
					Modi sapiente, facilis velit laudantium fuga ullam explicabo laborum
					delectus temporibus. Consequatur.
				</Card>
			</Col>
			<Col xs={24}>
				<TematicCardWithImage content={sharePhoto.tematic} />
			</Col>
			<Col
				xs={24}
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					marginTop: 6,
				}}>
				<ChooseButton
					// onClick={() => alert('Go to Galery View')}
					onClick={() => goTo('galery')}
					icon={<TableOutlined style={{ fontSize: '40px' }} />}
					label='Ver galeria'
				/>
				<ChooseButton
					// onClick={() => alert('Go to ChooseAction View')}
					onClick={() => goTo('chooseAction')}
					icon={<CameraOutlined style={{ fontSize: '40px' }} />}
					label='Subir mi foto'
				/>
			</Col>
		</Row>
	);
}
