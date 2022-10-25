import { Card, Col, Form, Input, Row, Typography } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabSetup(props: Props) {
	const { sharePhoto } = props;
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24}>
				<Card title='Dinamica'>
					<Form.Item label={<label>Nombre de la dinamica</label>} initialValue={sharePhoto.title} name='title'>
						<Input type='text' />
					</Form.Item>
					<Form.Item
						label={<label>Puntos por like</label>}
						initialValue={Number(sharePhoto.points_per_like)}
						name='points_per_like'>
						<Input type='number' />
					</Form.Item>
				</Card>
			</Col>
			<Col xs={24}>
				<Card title='Tematica'>
					<Form.Item label={<label>Tematica</label>} initialValue={sharePhoto.tematic} name='tematic'>
						<Input type='text' />
					</Form.Item>
				</Card>
			</Col>
			<Col xs={24}>
				<Card title='Instrucciones'>
					<Typography>
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet, cum sunt rerum similique, veritatis
						necessitatibus officiis quaerat sapiente error nulla modi. Sequi reprehenderit dolorem, est quod nihil
						tenetur id temporibus consectetur, nostrum repellendus corporis. Minus odit quia inventore quibusdam
						quaerat?
					</Typography>
				</Card>
			</Col>
		</Row>
	);
}
