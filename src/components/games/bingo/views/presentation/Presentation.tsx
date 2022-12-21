import { UseEventContext } from '@/context/eventContext';
import { getCorrectColor } from '@/helpers/utils';
import { Badge, Card, Col, Image, Row, Space, Typography } from 'antd';
import BallotHistoryContainer from '../../components/BallotHistoryContainer';
import CurrentBallotValue from '../../components/CurrentBallotValue';
import CardContainer from '../../components/presentation/CardContainer';
import { ballotsAnnounced } from '../../functions';
import useBingoPresentation from '../../hooks/useBingoPresentation';
import { useDrawerBingo } from '../../hooks/useDrawerBingo';

export default function Presentation() {
	const { bingoGame } = useBingoPresentation();
	const cEvent = UseEventContext();
	const gridResponsive = {
		xs: 24,
		sm: 24,
		md: 24,
		lg: 12,
		xl: 12,
		xxl: 12,
	};
	return (
		<div style={{ height: '100vh', width: '100%', padding: '30px 40px', backgroundColor: '#F9FAFE' }}>
			<Row gutter={[16, 16]} style={{ height: '100%', width: '100%' }}>
				<Col {...gridResponsive} style={{ height: '100%' }}>
					<Row gutter={[16, 16]} style={{ height: '100%' }}>
						<Col span={24}>
							<CardContainer title='Balotera'>
								{!!bingoGame ? (
									<CurrentBallotValue ballotValue={bingoGame?.currentValue} cEvent={cEvent} />
								) : (
									<p>Aun no empieza el bingo</p>
								)}
							</CardContainer>
						</Col>
						<Col span={24}>
							<CardContainer title='Figura'>
								{!!bingoGame ? (
									<Card bordered={false}>
										<Space direction='vertical' align='center'>
											{!!bingoGame?.template?.image && (
												<Image preview={false} src={bingoGame?.template?.image} width={150} height={150} />
											)}
											{!!bingoGame?.template?.title && <Typography.Text>{bingoGame?.template?.title}</Typography.Text>}
										</Space>
									</Card>
								) : (
									<Typography.Paragraph style={{ width: '60%', textAlign: 'center' }}>
										¡No pierdas el foco! en esta parte tendrás disponible la figura que se está jugando
									</Typography.Paragraph>
								)}
							</CardContainer>
						</Col>
					</Row>
				</Col>
				<Col {...gridResponsive} style={{ height: '100%' }}>
					<CardContainer
						title='Historial de balotas'
						extra={
							<Badge
								title={`${ballotsAnnounced(32)}`}
								count={ballotsAnnounced(32)}
								style={{
									backgroundColor: '#517FD6',
									color: getCorrectColor('#517FD6'),
								}}
							/>
						}>
						{!!bingoGame ? (
							<BallotHistoryContainer demonstratedBallots={bingoGame?.demonstratedBallots} />
						) : (
							<p>Aun no empieza el bingo</p>
						)}
					</CardContainer>
				</Col>
			</Row>
		</div>
	);
}
