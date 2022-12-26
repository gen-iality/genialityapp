import { UseEventContext } from '@/context/eventContext';
import { getCorrectColor } from '@/helpers/utils';
import { Badge, Card, Col, Image, Row, Space, Typography } from 'antd';
import { ColProps } from 'antd/es/grid/col';
import CurrentBallotValue from '../../components/CurrentBallotValue';
import BallotHistoryPresentation from '../../components/presentation/BallotHistoryPresentation';
import CardContainer from '../../components/presentation/CardContainer';
import { ballotsAnnounced } from '../../functions';
import useBingoPresentation from '../../hooks/useBingoPresentation';

export default function Presentation() {
	const { bingoGame } = useBingoPresentation();
	const cEvent = UseEventContext();
	const gridResponsive: ColProps = {
		xs: 24,
		sm: 24,
		md: 24,
		lg: 12,
		xl: 12,
		xxl: 12,
	};
	return (
		<div
			style={{
				height: '100vh',
				overflowY: 'hidden',
				width: '100%',
				padding: '30px 40px',
				backgroundColor: '#F9FAFE',
				backgroundImage: `url(${cEvent?.value?.styles?.BackgroundImage})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}>
			<Row gutter={[16, 0]} style={{ height: '100%', width: '100%' }}>
				<Col {...gridResponsive} style={{ height: '100%' }}>
					<Row gutter={[0, 16]} style={{ height: '100%' }}>
						<Col span={24}>
							<CardContainer title='Balotera'>
								<Row style={{ height: '100%' }} align='top' justify='center'>
									{!!bingoGame ? (
										<CurrentBallotValue ballotValue={bingoGame?.currentValue} cEvent={cEvent} />
									) : (
										<p>Aun no empieza el bingo</p>
									)}
								</Row>
							</CardContainer>
						</Col>
						<Col span={24}>
							<CardContainer title='Figura'>
								<Row style={{ height: '100%' }} align='top' justify='center'>
									{!!bingoGame ? (
										<Card bodyStyle={{ padding: '0px' }} bordered={false}>
											<Space direction='vertical' align='center'>
												{!!bingoGame?.template?.image && (
													<Image preview={false} src={bingoGame?.template?.image} width={150} height={150} />
												)}
												{!!bingoGame?.template?.title && (
													<Typography.Text>{bingoGame?.template?.title}</Typography.Text>
												)}
											</Space>
										</Card>
									) : (
										<Typography.Paragraph style={{ width: '60%', textAlign: 'center' }}>
											¡No pierdas el foco! en esta parte tendrás disponible la figura que se está jugando
										</Typography.Paragraph>
									)}
								</Row>
							</CardContainer>
						</Col>
					</Row>
				</Col>
				<Col {...gridResponsive} style={{ height: '100%' }}>
					<CardContainer
						title='Historial de balotas'
						extra={
							<Badge
								title={`${ballotsAnnounced(bingoGame?.demonstratedBallots?.length || 0)}`}
								count={ballotsAnnounced(bingoGame?.demonstratedBallots?.length || 0)}
								style={{
									backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
									color: getCorrectColor(cEvent.value?.styles?.toolbarDefaultBg),
								}}
							/>
						}>
						{!!bingoGame ? (
							<BallotHistoryPresentation demonstratedBallots={bingoGame?.demonstratedBallots} />
						) : (
							<p>Aun no empieza el bingo</p>
						)}
					</CardContainer>
				</Col>
			</Row>
		</div>
	);
}
