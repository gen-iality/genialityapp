import { DeleteFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Comment, Image, Modal, ModalProps, Row, Space, Tag, Typography } from 'antd';
import { where } from 'firebase/firestore';
import { KonvaEventObject } from 'konva/lib/Node';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Circle, Layer, Stage, Label, Text } from 'react-konva';
import useWhereIs from '../../hooks/useWhereIs';
import { CreatePointDto, Point, WhereIs } from '../../types';
import ListPoints from './ListPoints';
import ModalPoints from './ModalPoints';

interface Props {
	whereIs: WhereIs;
}

export default function TabSetupPoints(props: Props) {
	const { whereIs } = props;
	const { createPoint, points, updatePoints, deletePoint, partialLoading: loading } = useWhereIs();
	const [konvaContainer, setKonvaContainer] = useState<HTMLDivElement | null>(null);
	const [resizeFactor, setResizeFactor] = useState(1);
	// Points
	const [pointMode, setPointMode] = useState<'none' | 'create' | 'update' | 'delete'>('none');
	const [pointsCreate, setPointsCreate] = useState<CreatePointDto[]>([]);
	const [pointCreate, setPointCreate] = useState<CreatePointDto | null>(null);
	const [pointsAction, setPointsAction] = useState<Point[]>([]);
	const [pointAction, setPointAction] = useState<Point | null>(null);
	const [pointHover, setPointHover] = useState<Point | null>(null);

	const ref = useRef(null);

	// ----------------- Logic for konva size -----------------
	// TODO: Build hook that can be resize image and converts value points to real size image
	// TODO: Add event listener
	useEffect(() => {
		if (ref.current) {
			setKonvaContainer(ref.current);
		}
	}, [ref]);

	useEffect(() => {
		if (konvaContainer?.clientWidth) {
			const resizeFactor = konvaContainer?.clientWidth / whereIs.game_image_width;
			setResizeFactor(resizeFactor);
		}
	}, [konvaContainer?.clientWidth]);

	// // TODO: Clean after finish coding
	// useEffect(() => {
	//   console.log('pointMode', pointMode);
	// }, [pointMode]);

	// ----------------- Logic create points -----------------
	const handleCreatePointsState = () => {
		setPointMode('create');
		setPointsCreate(points);
	};

	const handleCreatePointClick = async (e: KonvaEventObject<MouseEvent>) => {
		const stage = e.target.getStage();
		if (!stage) return;
		const pointerPosition = stage.getPointerPosition();
		if (!pointerPosition) return;
		const newPoint = {
			image: '',
			label: '',
			radius: 20,
			x: pointerPosition.x * (1 / resizeFactor),
			y: pointerPosition.y * (1 / resizeFactor),
		};
		setPointCreate(newPoint);
		// await createPoint(newPoint);
		// handleNonePointsState();
	};

	const handleSaveCreatePoint = async () => {
		// console.log(pointCreate);
		if (!!pointCreate) {
			await createPoint(pointCreate);
		}
		handleNonePointsState();
	};

	// ----------------- Logic read points -----------------
	const handleNonePointsState = () => {
		setPointMode('none');
		setPointAction(null);
		setPointCreate(null);
		setPointsAction([]);
	};

	const handleCancelPointUpdate = () => {
		setPointAction(null);
	};

	// ----------------- Logic update points -----------------
	const handleUpdatePointsState = () => {
		setPointMode('update');
		setPointsAction(points);
	};

	const handleUpdatePointState = (e: KonvaEventObject<MouseEvent>) => {
		const pointId = e.target.id();
		const pointToEdit = pointsAction.find((point) => point.id === pointId);
		if (!pointToEdit) return;
		setPointAction(pointToEdit);
	};

	const handleDragPoint = (e: KonvaEventObject<MouseEvent>) => {
		e.cancelBubble = true;
		const stage = e.target.getStage();
		if (!stage) return;
		const pointerPosition = stage.getPointerPosition();
		if (!pointerPosition) return;
		const pointId = e.target.id();
		const pointToEdit = pointsAction.find((point) => point.id === pointId);
		if (pointToEdit) {
			const pointEdited = {
				...pointToEdit,
				x: pointerPosition.x * (1 / resizeFactor),
				y: pointerPosition.y * (1 / resizeFactor),
			};
			setPointsAction((prev) =>
				[...prev.filter((point) => point.id !== pointId), pointEdited].sort(
					(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				)
			);
		}
	};

	const handleSaveUpdatePoints = async () => {
		await updatePoints(pointsAction);
		handleNonePointsState();
	};

	const handleSaveUpdatePoint = async () => {
		if (!!pointAction) {
			setPointsAction((prev) =>
				[...prev.filter((point) => point.id !== pointAction.id), pointAction].sort(
					(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
				)
			);
		}
		setPointAction(null);
	};

	// ----------------- Logic delete points -----------------
	const handleDeletePointsState = () => {
		setPointMode('delete');
		setPointsAction(points);
	};

	const handleDeleteClick = async (e: KonvaEventObject<MouseEvent>) => {
		e.cancelBubble = true;
		const pointId = e.target.id();
		await deletePoint(pointId);
		handleNonePointsState();
	};

	// ----------------- Find points -----------------
	const handleResetPoints = async () => {
		const newOrderPoints = points.map((point, i) => ({
			...point,
			x: (i + 1) * 100,
			y: (i + 1) * 100,
			radius: 30,
		}));
		await updatePoints(newOrderPoints);
	};

	/** Constant to validate the type of cursor to use
	 * 'none' | 'create' | 'update' | 'delete'
	 */

	// Marlon's whims
	const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
		if (!!pointHover) return;
		const pointToSet = points.find((point) => point.id === e.target.id());
		if (!!pointToSet) setPointHover(pointToSet);
	};

	const handleMouseOut = () => {
		setPointHover(null);
	};

	const cursors = {
		none: 'default',
		create: 'crosshair',
		update: 'move',
		delete: 'alias',
		loading: 'progress',
	};

	const showModalConfirm = () => {
		Modal.confirm({
			title: '¿Esta seguro que desea reiniciar sus puntos?',
			content: ' ',
			type: 'warning',
			onOk: () => handleResetPoints(),
			okButtonProps: { type: 'primary' },
			okText: 'Si, reiniciar',
			cancelText: 'No',
		});
	};
	return (
		<>
			{pointMode === 'create' && !!pointCreate && (
				<ModalPoints
					open={!!pointCreate}
					pointCreate={pointCreate}
					setPointCreate={setPointCreate}
					mode='create'
					handleClose={handleNonePointsState}
					handleOk={handleSaveCreatePoint}
					loading={loading}
				/>
			)}
			{pointMode === 'update' && !!pointAction && (
				<ModalPoints
					open={!!pointAction}
					point={pointAction}
					setPoint={setPointAction}
					mode='update'
					handleClose={handleCancelPointUpdate}
					handleOk={handleSaveUpdatePoint}
					loading={loading}
				/>
			)}
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card
						title={`Puntos asignados: ${points.length} de 5`}
						extra={
							<Space>
								{pointMode === 'none' && (
									<Button
										size='large'
										onClick={handleCreatePointsState}
										style={
											points.length === 5
												? { backgroundColor: '#F3F3F3', color: '#D2D2D2' }
												: { backgroundColor: '#1890FF', color: '#FFFFFF' }
										}
										disabled={points.length === 5}
										loading={loading}>
										Anadir punto
									</Button>
								)}
								{pointMode === 'none' && !!points.length && (
									<Button
										size='large'
										onClick={handleUpdatePointsState}
										style={{ backgroundColor: '#FAAD14', color: '#FFFFFF' }}
										loading={loading}>
										Editar puntos
									</Button>
								)}
								{pointMode === 'none' && !!points.length && (
									<Button size='large' type='primary' onClick={handleDeletePointsState} danger loading={loading}>
										Borrar punto
									</Button>
								)}
								{pointMode === 'update' && (
									<Button
										size='large'
										onClick={handleSaveUpdatePoints}
										style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
										loading={loading}>
										Guardar
									</Button>
								)}
								{(pointMode === 'create' || pointMode === 'update' || pointMode === 'delete') && (
									<Button size='large' onClick={handleNonePointsState} loading={loading}>
										Cancelar
									</Button>
								)}
							</Space>
						}>
						<div ref={ref} style={{ margin: 'auto 0', height: 'auto', width: '100%', position: 'relative' }}>
							{pointHover && (
								<Card
									bordered={false}
									bodyStyle={{ padding: '15px' }}
									style={{
										position: 'absolute',
										top: pointHover.y * resizeFactor + 20,
										left: pointHover.x * resizeFactor + 20,
										backgroundColor: '#000000CC',
										boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
										zIndex: '999',
										minWidth: '220px',
									}}>
									<Space align='start'>
										<Image
											src={pointHover.image}
											height={90}
											width={90}
											fallback={'https://via.placeholder.com/500/?text=Sin imagen'}
											preview={false}
											style={{
												objectFit: 'contain',
											}}
										/>
										<Space direction='vertical' size={0}>
											<Typography.Text strong style={{ color: '#FFFFFF' }}>
												{pointHover.label}
											</Typography.Text>
											<Space direction='vertical' size={0}>
												<Typography.Text style={{ color: '#FFFFFF' }}>
													<Space>
														X:<span>{+pointHover.x.toFixed(2)}</span>
													</Space>
												</Typography.Text>
												<Typography.Text style={{ color: '#FFFFFF' }}>
													<Space>
														Y:<span>{+pointHover.y.toFixed(2)}</span>
													</Space>
												</Typography.Text>
											</Space>
											<small style={{ position: 'absolute', bottom: '5px', right: '5px', color: '#FFFFFF' }}>
												{pointMode === 'update'
													? 'Clic para editar'
													: pointMode === 'delete'
													? 'Clic para eliminar'
													: ''}
											</small>
										</Space>
									</Space>
								</Card>
							)}
							<Stage
								height={whereIs.game_image_height * resizeFactor}
								width={whereIs.game_image_width * resizeFactor}
								style={{
									height: whereIs.game_image_height * resizeFactor,
									width: whereIs.game_image_width * resizeFactor,
									backgroundImage: `url("${whereIs.game_image}")`,
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'contain',
									cursor: loading ? cursors.loading : cursors[pointMode],
								}}
								onClick={pointMode === 'create' ? handleCreatePointClick : undefined}>
								<Layer>
									{pointMode === 'none' &&
										points.map((point, index) => (
											<Fragment key={point.id}>
												<Circle
													id={point.id}
													x={point.x * resizeFactor}
													y={point.y * resizeFactor}
													fill='#000000CC'
													radius={point.radius * resizeFactor}
													stroke={'#000000'}
													onMouseMove={handleMouseMove}
													onMouseOut={handleMouseOut}
												/>
											</Fragment>
										))}
									{pointMode === 'update' &&
										pointsAction.map((point, index) => (
											<Fragment key={point.id}>
												<Circle
													id={point.id}
													x={point.x * resizeFactor}
													y={point.y * resizeFactor}
													fill='#FAAD1466'
													radius={point.radius * resizeFactor}
													draggable
													// onDragEnd={handleDragPoint}
												/>

												<Circle
													id={point.id}
													x={point.x * resizeFactor}
													y={point.y * resizeFactor}
													fill='#FAAD14CC'
													radius={point.radius * resizeFactor}
													stroke={'#FAAD14'}
													draggable
													onDragEnd={handleDragPoint}
													onClick={handleUpdatePointState}
													onMouseMove={handleMouseMove}
													onMouseOut={handleMouseOut}
												/>
											</Fragment>
										))}
									{pointMode === 'delete' &&
										pointsAction.map((point, index) => (
											<Fragment key={point.id}>
												<Circle
													id={point.id}
													x={point.x * resizeFactor}
													y={point.y * resizeFactor}
													fill='#EB0F0FCC'
													radius={point.radius * resizeFactor}
													stroke={'#EB0F0F'}
													onClick={handleDeleteClick}
													onMouseMove={handleMouseMove}
													onMouseOut={handleMouseOut}
												/>
											</Fragment>
										))}
									{pointMode === 'create' &&
										pointsCreate.map((point, index) => (
											<Fragment key={`point-create-${index}`}>
												<Circle
													id={String(index)}
													x={point.x * resizeFactor}
													y={point.y * resizeFactor}
													fill='#000000CC'
													radius={point.radius * resizeFactor}
													stroke={'#000000'}
												/>
											</Fragment>
										))}
								</Layer>
							</Stage>
						</div>
						<Row style={{ marginTop: 20 }}>
							<Col>
								<Button onClick={showModalConfirm}>No veo mis puntos</Button>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={24}>
					<ListPoints />
				</Col>
			</Row>
		</>
	);
}
