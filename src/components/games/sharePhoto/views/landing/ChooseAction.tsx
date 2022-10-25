import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import ChooseButton from '../../components/landing/ChooseButton';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function ChooseAction() {
	const { goTo } = useSharePhotoInLanding();
	return (
		<>
			<Row gutter={[12, 12]}>
				<Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={() => goTo('introduction')}>Atras</Button>
				</Col>
				<Col xs={24} style={{ display: 'flex', height: '50vh', alignItems: 'center' }}>
					<ChooseButton
						onClick={() => goTo('importPhoto')}
						icon={<UploadOutlined style={{ fontSize: '40px' }} />}
						label='Subir foto'
					/>
					<ChooseButton
						onClick={() => goTo('takePhoto')}
						icon={<CameraOutlined style={{ fontSize: '40px' }} />}
						label='Tomar foto'
					/>
				</Col>
			</Row>
		</>
	);
}
