import { UseEventContext } from '@/context/eventContext';
import { getCorrectColor } from '@/helpers/utils';
import { Avatar, Badge, Card, Col, Image, List, Row, Space, Tag, Typography } from 'antd';
import { ballotsAnnounced, orderedDemonstratedBallots } from '../../functions';
import { BallotHistoryInterface } from '../../interfaces/bingo';

const { Title } = Typography;

const BallotHistoryPresentation = ({ demonstratedBallots = [], mediaUrl }: BallotHistoryInterface) => {
	const cEvent = UseEventContext();

	/* console.log(
    'orderedDemonstratedBallots({ demonstratedBallots })',
    orderedDemonstratedBallots({ demonstratedBallots })
  ); */
	if (!cEvent.value) return null
	return (
		<div
			className='desplazar'
			style={{
				width: '100%',
				height: '560px',
				overflowY: 'auto',
				padding: '5px',
			}}>
			{demonstratedBallots.length > 0 ? (
				<Row gutter={[8, 8]} align={'stretch'}>
					{orderedDemonstratedBallots({ demonstratedBallots }).map((item: any, index: number) => (
						<Col key={`ballot-${index}-${item.value[0]}`} span={8}>
							<Card
								bordered={false}
								style={{ height: '100%', borderRadius: '10px', backgroundColor: 'transparent' }}
								bodyStyle={{ padding: '10px 10px', height: '100%' }}>
								<Row align='middle' justify='center' style={{ height: '100%' }}>
									{item?.value?.toString().length <= 2 ? (
										<Avatar
											size={80}
											style={{
												boxShadow: 'inset 0px 0px 20px rgba(0, 0, 0, 0.25)',
												backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
											}}>
											<Typography.Text
												strong
												style={{
													color: getCorrectColor(cEvent.value?.styles?.toolbarDefaultBg),
													fontSize: '26px',
												}}>
												{item?.value}
											</Typography.Text>
										</Avatar>
									) : (
										<>
											{item?.type === 'image' && (
												<Image
													preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
													style={{ borderRadius: '10px', objectFit: 'cover' }}
													width={80}
													height={80}
													src={item?.value}
													alt={item?.value}
												/>
											)}
											{item.type !== 'image' && (
												<Typography.Text style={{ textAlign: 'center', fontSize: '16px' }}>
													{item?.value}
												</Typography.Text>
											)}
										</>
									)}
								</Row>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<Row style={{ height: '100%' }} justify='center' align='top'>
					<Typography.Text style={{ width: '60%', textAlign: 'center' }}>
						Aquí encontraras un listado con las balotas que ya fueron anunciadas para que puedas verificar en tu cartón,
						sin embargo, ¡No te preocupes que tendrás realimentación permanente!
					</Typography.Text>
				</Row>
			)}
		</div>
	);
};

export default BallotHistoryPresentation;
