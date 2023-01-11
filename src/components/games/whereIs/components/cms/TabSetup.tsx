import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Card, Col, Form, Input, InputNumber, Row, Switch, Typography } from 'antd';
import { WhereIs } from '../../types';

interface Props {
	whereIs: WhereIs;
	gameImage: WhereIs['game_image'];
	setGameImage: React.Dispatch<React.SetStateAction<WhereIs['game_image']>>;
	dimensions: {
		width: number;
		height: number;
	};
	setDimensions: React.Dispatch<
		React.SetStateAction<{
			width: number;
			height: number;
		}>
	>;
}

export default function TabSetup(props: Props) {
	const { whereIs, gameImage, setGameImage, dimensions, setDimensions } = props;
	return (
		<>
			<Row gutter={[16, 16]} style={{ padding: '40px' }}>
				<Col span={18}>
					<Card hoverable style={{ borderRadius: '20px', height: '100%' }}>
						<Form.Item
							rules={[{ required: true, message: 'El nombre es requerido' }]}
							label={<label>Nombre de la dinamica</label>}
							initialValue={whereIs.title}
							name='title'>
							<Input type='text' showCount maxLength={50} />
						</Form.Item>
						<Form.Item
							rules={[
								{ type: 'number', min: 1, message: 'El valor debe ser superior o igual a 1' },
								{ required: true, message: 'El valor debe ser superior o igual a 1' },
							]}
							label={<label>Lifes</label>}
							initialValue={Number(whereIs.lifes)}
							name='lifes'>
							<InputNumber min={1} type='number' />
						</Form.Item>
					</Card>
				</Col>
				<Col span={6}>
					<Card hoverable style={{ borderRadius: '20px' }}>
						<Form.Item
							tooltip='Controla la visibilidad del módulo para los asistentes'
							label={<label>Publicar dinámica</label>}
							initialValue={whereIs.published}
							valuePropName='checked'
							name='published'>
							<Switch checkedChildren='Si' unCheckedChildren='No' />
						</Form.Item>
						<Form.Item
							tooltip='Abrir o cerrar la dinámica para que los asistentes puedan participar'
							label={<label>Abrir dinámica</label>}
							initialValue={whereIs.active}
							valuePropName='checked'
							name='active'>
							<Switch checkedChildren='Si' unCheckedChildren='No' />
						</Form.Item>
						{/* Aqui deberia ir lo de controlar el estado publicado y abierto */}
					</Card>
				</Col>
				<Col span={24}>
					<Card hoverable style={{ borderRadius: '20px' }}>
						<Form.Item label='Instrucciones' initialValue={whereIs.instructions} name='instructions'>
							<Input.TextArea
								autoSize={{ minRows: 5, maxRows: 8 }}
								cols={20}
								/*  wrap='hard' */
								placeholder={'Reglamento de Buscando el elemento'}
							/>
						</Form.Item>
					</Card>
				</Col>
				<Col span={24}>
					<Card hoverable style={{ borderRadius: '20px', height: '100%' }} title='Fondo de la dinamica'>
						{/* TODO: This component is working bad, don't allow delete image */}
						<ImageUploaderDragAndDrop
							imageDataCallBack={imageUrl => {
								if (typeof imageUrl === 'string') {
									setGameImage(imageUrl);
								}
							}}
							getDimensionsCallback={dimensions => setDimensions(dimensions)}
							imageUrl={gameImage ?? ''}
							width={1080}
							height={1080}
						/>
						{gameImage.length > 0 && (
							<Row>
								<Col span={12}>
									<Form.Item
										rules={[
											{ type: 'number', min: 0, message: 'El valor debe ser superior o igual a 1' },
											{ required: true, message: 'El valor debe ser superior o igual a 1' },
										]}
										label={<label>Ancho de la imagen</label>}
										initialValue={dimensions.width}
										name='game_image_width'>
										<InputNumber
											min={0}
											type='number'
											// onChange={width => setDimensions(prev => ({ ...prev, width }))}
											disabled
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										rules={[
											{ type: 'number', min: 0, message: 'El valor debe ser superior o igual a 1' },
											{ required: true, message: 'El valor debe ser superior o igual a 1' },
										]}
										label={<label>Alto de la imagen</label>}
										initialValue={dimensions.height}
										name='game_image_height'>
										<InputNumber
											min={0}
											type='number'
											// onChange={height => setDimensions(prev => ({ ...prev, height }))}
											disabled
										/>
									</Form.Item>
								</Col>
							</Row>
						)}
					</Card>
				</Col>
			</Row>
		</>
	);
}
