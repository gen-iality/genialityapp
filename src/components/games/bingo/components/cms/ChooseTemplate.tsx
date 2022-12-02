import { Button, Card, Col, Form, Image, Input, Modal, Popconfirm, Row, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { BingoValue, DimensionInterface, PickedNumberInterface } from '../../interfaces/bingo';

const templates = [
	{
		title: 'Default',
		format: '5x5',
		image:
			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/template_bingos%2Ffigures_5x5%2F5x5_default.jpg?alt=media&token=1ed20309-6ad6-4545-8381-cdecc0c928c9',
		index_to_validate: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
		updated_at: '2022-12-01 20:11:31',
		created_at: '2022-12-01 20:11:31',
		_id: '63890a77ffb498269603c7d3',
	},
	{
		_id: '6389058effb498269603c7d2',
		title: 'Esquinas',
		format: '5x5',
		image:
			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/template_bingos%2Ffigures_5x5%2F5x5_esquinas.jpg?alt=media&token=950b7636-ffe2-41c9-b08b-829ff60079d0',
		index_to_validate: [0, 4, 20, 24],
		updated_at: '2022-12-01 19:50:32',
		created_at: '2022-12-01 19:50:32',
	},
	{
		_id: '638906547d4bdaceaa0a8f72',
		title: 'Primera columna',
		format: '5x5',
		image:
			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/template_bingos%2Ffigures_5x5%2F5x5_first_column.jpg?alt=media&token=b98e3766-4645-4657-be42-6c19d859d3b2',
		index_to_validate: [0, 5, 10, 20],
		updated_at: '2022-12-01 19:53:48',
		created_at: '2022-12-01 19:53:48',
	},
];

interface Props {
	type: 'start' | 'restart';
	bingoValues: BingoValue[];
	playing: boolean;
	pickedNumber: PickedNumberInterface;
	startGame: () => void;
	endGame: () => void;
	restartGame: () => void;
	dimensions: DimensionInterface;
}

export default function ChooseTemplate(props: Props) {
	const { type, bingoValues, dimensions, endGame, pickedNumber, playing, restartGame, startGame } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
		if (type === 'start') startGame();
		if (type === 'restart') restartGame();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{type === 'start' && (
				<Tooltip
					title={bingoValues.length < dimensions.minimun_values ? `${dimensions.minimun_values} valores minimo` : ''}>
					<Button type='primary' disabled={bingoValues.length < dimensions.minimun_values} onClick={showModal}>
						Iniciar Bingo
					</Button>
				</Tooltip>
			)}
			{type === 'restart' && (
				<Popconfirm title='Estás seguro de reiniciar el BINGO?' onConfirm={showModal}>
					<Button>Nueva ronda</Button>
				</Popconfirm>
			)}
			<Modal
				okText='Iniciar Bingo'
				cancelText='Cancelar'
				title={
					<Typography.Title style={{ textAlign: 'center' }} level={4}>
						Selecciona un template
					</Typography.Title>
				}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Row style={{ paddingTop: '8px' }} gutter={[16, 16]}>
					{templates.map(template => (
						<Col key={template._id} span={8}>
							<Card hoverable>
								<Image src={template.image} preview={false} />
								<Typography.Paragraph style={{ textAlign: 'center', marginTop: '0.5rem' }}>
									{template.title}
								</Typography.Paragraph>
							</Card>
						</Col>
					))}
				</Row>
			</Modal>
		</>
	);
}
