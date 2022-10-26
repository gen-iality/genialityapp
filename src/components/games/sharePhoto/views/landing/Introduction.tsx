import { CameraOutlined, TableOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import { useEffect } from 'react';
import ChooseButton from '../../components/landing/ChooseButton';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function Introduction() {
	const { sharePhoto, listenSharePhoto } = useSharePhoto();
	const { goTo } = useSharePhotoInLanding();

	useEffect(() => {
		if (sharePhoto !== null) {
			const unSubscribe = listenSharePhoto();
			return () => unSubscribe();
		}
	}, [sharePhoto]);

	if (!sharePhoto) {
		return <p>Ups! esta dinamica no existe aun!</p>;
	}

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col xs={24} md={12}>
					<Card title='Tematica' headStyle={{ textAlign: 'center' }} style={{ height: '100%' }}>
						<Typography>{sharePhoto.tematic}</Typography>
					</Card>
				</Col>
				<Col
					xs={24}
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						marginTop: 6,
					}}>
					<ChooseButton
						onClick={() => goTo('galery')}
						icon={<TableOutlined style={{ fontSize: '40px' }} />}
						label='Ver galeria'
					/>
					<ChooseButton
						onClick={() => goTo('chooseAction')}
						icon={<CameraOutlined style={{ fontSize: '40px' }} />}
						label='Subir mi foto'
					/>
				</Col>
				<Col xs={24} md={12}>
					<Card title='Instrucciones' headStyle={{ textAlign: 'center' }} style={{ height: '100%' }}>
						<Typography>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita aliquam veniam magni assumenda, illo hic
							facere optio natus cupiditate impedit exercitationem nostrum autem nam eum reiciendis id neque atque ab.
							Atque quaerat corporis, omnis alias asperiores iure laudantium. Modi sapiente, facilis velit laudantium
							fuga ullam explicabo laborum delectus temporibus. Consequatur.
						</Typography>
					</Card>
				</Col>
			</Row>
		</>
	);
}
