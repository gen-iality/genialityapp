import Header from '@/antdComponents/Header';
import { Card, Col, Form, Input, Row, Switch, Tabs, Typography } from 'antd';
import TematicInput from '../../components/TematicInput';
import useSharePhoto from '../../hooks/useSharePhoto';

interface Props {
	eventId: string;
}

export default function UpdateSharePhoto(props: Props) {
  const { eventId } = props;
	const { sharePhoto, deleteSharePhoto, updateSharePhoto } = useSharePhoto();

	const handleDelete = () => {
		deleteSharePhoto(eventId);
	};

	const handleFinish = (values: {
		title: string;
		points_per_like: number;
		active: boolean;
		published: boolean;
	}) => {
		const { title, points_per_like, active, published } = values;
		updateSharePhoto({
			title,
			points_per_like: Number(points_per_like),
			active,
			published,
		});
	};

	return (
		<Form onFinish={handleFinish}>
			<Header
				title='Comparte tu foto 📷!'
				description={''}
				back
				edit
				save
				form
				remove={handleDelete}
			/>
			<Tabs>
				<Tabs.TabPane tab='Configurar' key='1'>
					<Row>
						<Col xs={24}>
							<Card title='Dinamica'>
								<Form.Item
									label={<label>Nombre de la dinamica</label>}
									initialValue={sharePhoto?.title}
									name='title'>
									<Input type='text' />
								</Form.Item>
								<Form.Item
									label={<label>Puntos por like</label>}
									initialValue={sharePhoto?.points_per_like}
									name='points_per_like'>
									<Input type='number' />
								</Form.Item>
							</Card>
							<TematicInput />
						</Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Apariencia' key='2'>
					<Row>
						<Col></Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Publicar' key='3'>
					<Row>
						<Col xs={24}>
							<Card style={{ display: 'flex', justifyContent: 'center' }}>
								<Form.Item
									label={<label>Publicar</label>}
									valuePropName='checked'
									name='published'>
									<Switch />
								</Form.Item>
								<Form.Item
									label={<label>Activar</label>}
									valuePropName='checked'
									name='active'>
									<Switch />
								</Form.Item>
							</Card>
						</Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Resultados' key='4'>
					<Row>
						<Col xs={24}>
							<Card>Here goes results in rankingTrivia component</Card>
						</Col>
					</Row>
				</Tabs.TabPane>
			</Tabs>
		</Form>
	);
}
