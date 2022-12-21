import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { CreatePointDto, Point } from '../../types';

interface Props {
	open: boolean;
	loading: boolean;
	mode: 'create' | 'update';
	point?: Point;
	setPoint?: React.Dispatch<React.SetStateAction<Point | null>>;
	pointCreate?: CreatePointDto;
	setPointCreate?: React.Dispatch<React.SetStateAction<CreatePointDto | null>>;
	handleClose: () => void;
	handleOk: () => void;
}

export default function ModalPoints(props: Props) {
	const { open, mode, point, pointCreate, setPoint, setPointCreate, handleClose, handleOk, loading } = props;

	const handleChangePoint = (field: string, value: any) => {
		if (!!point && !!setPoint) {
			if (Object.keys(point).includes(field)) {
				setPoint((prev) =>
					!!prev
						? {
								...prev,
								[field]: value,
						  }
						: null
				);
			}
		}
		if (!!pointCreate && !!setPointCreate) {
			if (Object.keys(pointCreate).includes(field)) {
				setPointCreate((prev) =>
					!!prev
						? {
								...prev,
								[field]: value,
						  }
						: null
				);
			}
		}
	};

	const handleChangeImage = (value: any) => {
		if (typeof value !== 'string') return;
		const field = 'image';
		if (!!point && !!setPoint) {
			if (Object.keys(point).includes(field)) {
				setPoint((prev) =>
					!!prev
						? {
								...prev,
								[field]: value,
						  }
						: null
				);
			}
		}
		if (!!pointCreate && !!setPointCreate) {
			if (Object.keys(pointCreate).includes(field)) {
				setPointCreate((prev) =>
					!!prev
						? {
								...prev,
								[field]: value,
						  }
						: null
				);
			}
		}
	};

	if (!point && !pointCreate) return null;

	return (
		<Modal bodyStyle={{ padding: '30px' }} footer={null} onCancel={handleClose} visible={open}>
			<Form layout='vertical'>
				<Typography.Title level={5}>{mode === 'create' ? 'Nuevo punto' : 'Editar punto'}</Typography.Title>
				<Form.Item
					label={'Imagen del punto'}
					tooltip='La imagen aqui subida, servirá como pista para los participantes de la dinámica'
					required>
					<ImageUploaderDragAndDrop
						bodyStyles={{ padding: '0px' }}
						compactMode={true}
						imageUrl={(point?.image || pointCreate?.image) ?? ''}
						imageDataCallBack={handleChangeImage}
						width={100}
						height={100}
					/>
				</Form.Item>
				<Form.Item label={'Nombre'} name='label' initialValue={point?.label || pointCreate?.label}>
					<Input
						name='label'
						placeholder='Basic usage'
						onChange={(e) => handleChangePoint(e.target.name, e.target.value)}
						value={point?.label || pointCreate?.label}
					/>
				</Form.Item>
				<Form.Item label={'Radio'} initialValue={point?.radius || pointCreate?.radius} name='radius'>
					<InputNumber
						min={1}
						max={100}
						style={{ width: '100%' }}
						onChange={(value) => handleChangePoint('radius', value)}
						value={point?.radius || pointCreate?.radius}
					/>
				</Form.Item>

				<Row align='middle' justify='space-between'>
					<Col>
						<Tooltip title='Para editar las coordenadas debe mantener presionado el clic izquierdo sobre el punto y arrastrar.'>
							<Space>
								<Space>
									X<Tag>{+(point?.x || pointCreate?.x || 0).toFixed(2)}</Tag>
								</Space>
								<Space>
									Y<Tag>{+(point?.y || pointCreate?.y || 0).toFixed(2)}</Tag>
								</Space>
							</Space>
						</Tooltip>
					</Col>
					<Col>
						<Button size='large' type='text' onClick={handleClose} loading={loading}>
							Cancelar
						</Button>
						{mode === 'create' && (
							<Button size='large' type='primary' onClick={handleOk} disabled={!pointCreate?.image} loading={loading}>
								Guardar
							</Button>
						)}
						{mode === 'update' && (
							<Button size='large' type='primary' onClick={handleOk} loading={loading}>
								Guardar
							</Button>
						)}
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
