import { Button, Card, Col, Form, Image, Input, Modal, Popconfirm, Row, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import useBingoContext from '../../hooks/useBingoContext';
import { BingoValue, DimensionInterface, PickedNumberInterface } from '../../interfaces/bingo';

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
	const { templates, templateSelected, chooseTemplate } = useBingoContext();

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
					title={bingoValues?.length < dimensions.minimun_values ? `${dimensions.minimun_values} valores minimo` : ''}>
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
					{!!templates?.length && templates.map(template => (
						<Col key={template._id} span={8}>
							<Card
								hoverable
								onClick={() => chooseTemplate(template._id)}
								style={{ border: template._id === templateSelected?._id ? `1px solid black` : undefined }}>
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
