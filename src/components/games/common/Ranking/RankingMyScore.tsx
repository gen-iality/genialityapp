import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Divider, List, Row } from 'antd';
import { useState } from 'react';

export interface Score {
	name: string;
	uid: string;
	imageProfile: string;
	index: number;
	score: string;
}

interface Props {
	myScore: Score;
	type: 'time' | 'points';
}

export default function RankingMyScore(props: Props) {
	const { myScore, type } = props;
	const cEvent = UseEventContext();
	const { styles } = cEvent;
	const [loading, setloading] = useState(false);

	return (
		<>
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
						loading={loading}
						itemLayout='horizontal'
						dataSource={[myScore]}
						renderItem={(item, key) => <UsersCard type='ranking' item={item} isTime={type === 'time'} />}
					/>
				</div>
			</div>
		</>
	);
}
