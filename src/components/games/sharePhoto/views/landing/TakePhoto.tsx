import {
	CameraOutlined,
	DeleteOutlined,
	SendOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Image, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function TakePhoto() {
	const { goTo } = useSharePhotoInLanding();
	const [photo, setPhoto] = useState('');
	const [deviceSelected, setDeviceSeleted] = useState<number>(0);
	const [deviceId, setDeviceId] = useState<MediaDeviceInfo | null>(null);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	const handleDevices = useCallback(
		(mediaDevices: MediaDeviceInfo[]) => {
			const cameras = mediaDevices.filter(({ kind }) => kind === 'videoinput');
			setDevices(cameras);
			setDeviceId(cameras[deviceSelected]);
		},
		[setDevices]
	);

	const handleDevice = () => {
		const index = deviceSelected < devices.length - 1 ? deviceSelected + 1 : 0;
		setDeviceSeleted(index);
		setDeviceId(devices[index]);
	};

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(handleDevices);
	}, [handleDevices]);

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button onClick={() => goTo('chooseAction')}>Atras</Button>
				{/* <Button>Siguiente</Button> */}
			</Col>
			<Col xs={24} style={{ display: 'grid', placeContent: 'center' }}>
				{!photo.length ? (
					deviceId && (
						<Card
							bodyStyle={{
								position: 'relative',
								display: 'grid',
								placeContent: 'center',
							}}>
							<Webcam
								videoConstraints={{
									deviceId: deviceId?.deviceId,
									aspectRatio: 1,
								}}
								width={400}
								height={400}
								mirrored={true}>
								{({ getScreenshot }) => (
									<Button
										style={{
											width: '60px',
											height: '60px',
											position: 'absolute',
											bottom: '8%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
										}}
										onClick={() => {
											const photo = getScreenshot();
											if (photo) {
												setPhoto(photo);
											}
										}}
										shape='circle'
										icon={<CameraOutlined style={{ fontSize: '40px' }} />}
									/>
								)}
							</Webcam>
							<Button
								style={{
									width: '60px',
									height: '60px',
									position: 'absolute',
									bottom: '8%',
									left: '25%',
									transform: 'translate(-50%, -50%)',
								}}
								type='primary'
								shape='circle'
								onClick={handleDevice}
								icon={<SwapOutlined style={{ fontSize: '40px' }} />}
							/>
						</Card>
					)
				) : (
					<Card>
						<Image src={photo} preview={false} />
						<Button
							style={{
								width: '60px',
								height: '60px',
								position: 'absolute',
								bottom: '8%',
								left: '75%',
								transform: 'translate(-50%, -50%)',
							}}
							shape='circle'
							onClick={() => alert('Go to CreatePost View')}
							icon={<SendOutlined style={{ fontSize: '40px' }} />}
						/>
						<Button
							style={{
								width: '60px',
								height: '60px',
								position: 'absolute',
								bottom: '8%',
								left: '25%',
								transform: 'translate(-50%, -50%)',
							}}
							type='primary'
							danger
							shape='circle'
							onClick={() => setPhoto('')}
							icon={<DeleteOutlined style={{ fontSize: '40px' }} />}
						/>
					</Card>
				)}
			</Col>
		</Row>
	);
}
