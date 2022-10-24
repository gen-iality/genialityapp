import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Button, Col, Form, Row } from 'antd';
import React, { useState } from 'react';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function ImportPhoto() {
	const { goTo } = useSharePhotoInLanding();
	const [image, setImage] = useState(null);
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={() => goTo('chooseAction')}>Atras</Button>
				{/* <Button>Siguiente</Button> */}
			</Col>
			<Col
				xs={24}
				style={{ display: 'grid', placeContent: 'center', height: '60vh' }}>
				<Form>
					<Form.Item>
						{/* Not working yet */}
						<ImageUploaderDragAndDrop
							imageDataCallBack={imageUrl => console.log(imageUrl)}
							imageUrl={''}
							width={1080}
							height={1080}
						/>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
}
