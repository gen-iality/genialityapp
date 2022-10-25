import { Card, Col, Form, Row, Switch } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabPublish(props: Props) {
  const { sharePhoto } = props;
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24}>
				<Card style={{ display: 'flex', justifyContent: 'center' }}>
					<Form.Item
						label={<label>Publicar</label>}
						initialValue={sharePhoto.published}
						valuePropName='checked'
						name='published'>
						<Switch />
					</Form.Item>
					<Form.Item
						label={<label>Activar</label>}
						initialValue={sharePhoto.active}
						valuePropName='checked'
						name='active'>
						<Switch />
					</Form.Item>
				</Card>
			</Col>
		</Row>
	);
}
