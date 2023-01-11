import Ranking from '@/components/games/common/Ranking';
import { Score } from '@/components/games/common/Ranking/types';
import { UseUserEvent } from '@/context/eventUserContext';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import useWhereIs from '../../hooks/useWhereIs';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
import { WhereIs } from '../../types';

interface Props {
	whereIs: WhereIs;
}

export default function TabResults(props: Props) {
	const { scores } = useWhereIs();

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
				<Card style={{ width: '100%', maxWidth: '600px' }}>
					<Ranking scores={scores} type='points' />
				</Card>
			</Col>
		</Row>
	);
}
