import UsersCard from '@/components/shared/usersCard';
import { UseEventContext } from '@/context/eventContext';
import { Divider, List, Row } from 'antd';
import React, { useState } from 'react';

export default function RankingList() {
	const cEvent = UseEventContext();
	const [loading, setLoading] = useState(false);
	const styles = cEvent.value.styles;

	const gameRanking = [
		{
			name: 'Marlon uno',
			imageProfile:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1656097848303.png?alt=media&token=24c5543b-4a25-455d-988f-2b35d5ad3f82',
			uid: '634878c188e8904f40664aa3',
			picture:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1656097848303.png?alt=media&token=24c5543b-4a25-455d-988f-2b35d5ad3f82',
			index: 1,
		},
		{
			name: 'Juan dos',
			imageProfile: '',
			uid: '634878c188e8904f40664aa3',
			picture:
				'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1667423736089.png?alt=media&token=a082b25a-8985-4332-b5b8-3182657dbdfd',
			index: 2,
		},
	];
	return (
		<div style={{ marginTop: 16 }}>
			<Row justify='center'>
				<h1
					style={{
						fontSize: '25px',
						fontWeight: 'bold',
						lineHeight: '3px',
						color: `${styles && styles.textMenu}`,
					}}>
					Ranking
				</h1>
				<Divider style={{ backgroundColor: `${styles && styles.textMenu}` }} />
			</Row>
			<div className='container-ranking' style={{ marginTop: 16, height: 'auto', overflowY: 'auto' }}>
				<List
					className='demo-loadmore-list'
					loading={loading}
					itemLayout='horizontal'
					dataSource={gameRanking}
					renderItem={(item, key) => <UsersCard type='ranking' item={item} />}
				/>
			</div>
		</div>
	);
}
