import { Button, Result, Grid, Typography, Space, Image, Card, Row, Col, Spin } from 'antd';
import useWhereIs from '../../hooks/useWhereIs';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
const { useBreakpoint } = Grid;

export default function Introduction() {
	const { whereIs } = useWhereIs();
	const {
		goTo,
		whereIsGame,
	} = useWhereIsInLanding();
	const { points } = whereIsGame
	const handleStart = () => {
		goTo('game');
	};
	const screens = useBreakpoint();
	return (
		<Result
			style={{ padding: '16px' }}
			icon={' '} // dejar el espacio en blanco para eliminar icono por defecto que trae el componente
			title={
				<Typography.Title level={screens.xs ? 3 : 1} style={{ letterSpacing: '0.1em' }}>
					{whereIs?.title}
				</Typography.Title>
			}
			subTitle={
				<Typography.Paragraph style={{ fontSize: screens.xs ? '16px' : '18px' }}>
					{whereIs?.instructions}
				</Typography.Paragraph>
			}
			extra={
				<Space size={'large'} direction='vertical'>
					<Card
						style={{ borderRadius: '15px' }}
						headStyle={{ border: 'none' }}
						title={
							<Typography.Title style={{ textAlign: 'center' }} level={5}>
								Elementos a buscar
							</Typography.Title>
						}>
						<Row gutter={[8, 8]} justify='center'>
							{points.map((point) => (
								<Col>
									<Image
										src={point.image}
										height={80}
										preview={false}
										fallback={'https://via.placeholder.com/500/?text=Sin imagen'}
										style={{
											filter: point.isFound ? 'grayscale(100%)' : '',
											maxWidth: '100px',
											objectFit: 'contain',
										}}
									/>
								</Col>
							))}
						</Row>
					</Card>
					<Button
						block={screens.xs ? true : false}
						onClick={handleStart}
						size='large'
						type='primary'
						style={{ letterSpacing: '0.1em', height: '48px' }}>
						¡Jugar!
					</Button>
				</Space>
			}></Result>
	);
}
