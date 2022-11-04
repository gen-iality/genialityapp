import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Divider, List, Row } from 'antd';
import { useState } from 'react';
import useWhereIsInLanding from '../../whereIs/hooks/useWhereIsInLanding';

export default function RankingMyScore() {
	const cEvent = UseEventContext();
	const { player } = useWhereIsInLanding();
	const { styles } = cEvent;
	const [loading, setloading] = useState(false);

	const myScore = [
		{
			names: 'fasfasdf',
			name: 'asdfasdf',
			imageProfile: '',
			uid: '634878c188e8904f40664aa3',
			picture:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1667423736089.png?alt=media&token=a082b25a-8985-4332-b5b8-3182657dbdfd',
			index: 1,
		},
		{
			names: 'asdfasdfas',
			name: 'fsadfdsaf',
			imageProfile: '',
			uid: '634878c188e8904f40664aa3',
			picture:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1667423736089.png?alt=media&token=a082b25a-8985-4332-b5b8-3182657dbdfd',
			index: 2,
		},
		{
			names: 'asdfasfd',
			name: '634878c188e8904f40664aa3',
			imageProfile: '',
			uid: '',
			picture:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1667423736089.png?alt=media&token=a082b25a-8985-4332-b5b8-3182657dbdfd',
			index: 3,
		},
	];

	return (
		<>
			{player ? (
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
							loading={loading}
							itemLayout='horizontal'
							dataSource={myScore}
							renderItem={(item, key) => <UsersCard type='ranking' item={item} />}
						/>
					</div>
				</div>
			)}
		</>
	);
}
