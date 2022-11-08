import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Card, Col, Divider, List, Row } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabResults(props: Props) {
	const { sharePhoto } = props;
	const cEvent = UseEventContext()
	const styles = cEvent.value.styles;
	const ranking = {
		userAlreadyParticipated: false,
		loading: false,
		myScore: [
			{
				uid: '1',
				imageProfile: 'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
				score: 100,
				name: 'Juan',
				index: 1,
			},
			{
				uid: '2',
				imageProfile: 'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
				score: 30,
				name: 'Another Juan',
				index: 2,
			}
		],
		item: {

		}
	};

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24}>
				<Card style={{ display: 'flex', justifyContent: 'center' }}>
					{ranking.userAlreadyParticipated ? (
						<div className='card-games-ranking ranking-user'></div>
					) : (
						<div style={{ marginTop: 16 }} className='card-games-ranking ranking-user'>
							<Row justify='center'>
								<h1
									style={{
										fontSize: '25px',
										fontWeight: 'bold',
										lineHeight: '3px',
										color: `${styles && styles.textMenu}`,
									}}>
									Mi Puntaje
								</h1>
								<Divider style={{ backgroundColor: `${styles && styles.textMenu}` }} />
							</Row>
							<div className='container-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
								<List
									className='demo-loadmore-list'
									loading={ranking.loading}
									itemLayout='horizontal'
									dataSource={ranking.myScore}
									renderItem={(item, key) => <UsersCard type='ranking' item={item} />}
								/>
							</div>
						</div>
					)}
				</Card>
			</Col>
		</Row>
	);
}
