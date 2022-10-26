import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Button, Col, Form, Row } from 'antd';
import { useState } from 'react';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function ImportPhoto() {
	const { goTo, imageUploaded, setImageUploaded } = useSharePhotoInLanding();
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button onClick={() => goTo('chooseAction')}>Atras</Button>
			</Col>
			<Col xs={24} style={{ display: 'grid', placeContent: 'center', height: '60vh' }}>
				{/* <Form> */}
					{/* <Form.Item> */}
						{/* Not working yet */}
						<ImageUploaderDragAndDrop
							imageDataCallBack={imageUrl => {
								if (typeof imageUrl === 'string' ) {
									setImageUploaded(imageUrl);
								}
							}}
							imageUrl={imageUploaded ?? ''}
							width={1080}
							height={1080}
						/>
						{imageUploaded && <Button type='primary' style={{ width: '100%' }} onClick={() => goTo('createPost')}>Crear Publicación</Button>}
					{/* </Form.Item> */}
				{/* </Form> */}
			</Col>
		</Row>
	);
}
