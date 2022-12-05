import { DispatchMessageService } from '@/context/MessageService';
import { CommentOutlined, FileProtectOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row, Space, Typography } from 'antd';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import { DrawerButtonsInterface, Template } from '../interfaces/bingo';
import useBingoContext from '../hooks/useBingoContext';

interface Props extends DrawerButtonsInterface {
	template?: Template | null;
}

export default function DrawerButtons({
	template,
	arrayLocalStorage,
	postBingoByUser,
	clearCarton,
	setshowDrawerChat = () => {},
	setshowDrawerRules = () => {},
	closedrawer,
}: Props) {
	const showModalConfirm = () => {
		Modal.confirm({
			title: '¿Esta seguro que desea limpiar el cartón del bingo?',
			type: 'warning',
			onOk: () => clearCarton(),
			okButtonProps: { type: 'primary', danger: true },
			okText: 'Limpiar cartón',
		});
	};
	const { bingo } = useBingo();
	const bingoColor = bingo?.bingo_appearance.background_color;
	const validateLength = template?.index_to_validate.length || 25;
	// console.log(validateLength)

	const singBingo = () => {
		Modal.info({
			centered: true,
			title: '¡Genial!, has cantado bingo',
			type: 'success',
			content: 'Un administrador está revisando su cartón',
			okText: 'Ok',
			okType: 'primary',
		});

		postBingoByUser();
	};

	return (
		<Card bordered={false} style={{ height: '100%', backgroundColor: 'transparent' }}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Row justify='center'>
						<Button
							className={
								arrayLocalStorage.filter(item => item === 1).length < validateLength
									? ''
									: 'animate__animated animate__heartBeat'
							}
							shape='circle'
							onClick={() => singBingo()}
							style={{
								width: '150px',
								height: '150px',
								border: `10px solid ${
									arrayLocalStorage.filter(item => item === 1).length < validateLength ? '#CECECE' : '#FF4D4F'
								}`,
								boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
							}}
							disabled={arrayLocalStorage.filter(item => item === 1).length < validateLength}
							type='default'>
							<Space direction='vertical'>
								<Typography.Text>Cantar</Typography.Text>
								<Typography.Text strong={true}>¡BINGO!</Typography.Text>
							</Space>
						</Button>
					</Row>
				</Col>
				<Col span={24}>
					<Button
						style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
						onClick={() => showModalConfirm()}
						size='large'
						block
						disabled={arrayLocalStorage.filter(item => item === 1).length === 0}>
						Limpiar carton
					</Button>
				</Col>
				<Col span={24}>
					<Button
						style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
						onClick={() => setshowDrawerRules(true)}
						icon={<FileProtectOutlined />}
						size='large'
						block>
						Reglas
					</Button>
				</Col>
				<Col span={24}>
					<Button
						style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
						onClick={() => setshowDrawerChat(true)}
						icon={<CommentOutlined />}
						size='large'
						block>
						Chat
					</Button>
				</Col>
				<Col span={24}>
					<Button
						style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
						onClick={() => closedrawer()}
						size='large'
						block>
						Cerrar
					</Button>
				</Col>
			</Row>
		</Card>
	);
}
