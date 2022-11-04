import CardsHeartIcon from '@2fd/ant-design-icons/lib/CardsHeart';
import HeartBrokenIcon from '@2fd/ant-design-icons/lib/HeartBroken';
import { Space } from 'antd';
import useWhereIs from '../../hooks/useWhereIs';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

export default function Lifes() {
	const { whereIs } = useWhereIs();
	const {
		whereIsGame: { lifes },
		location,
	} = useWhereIsInLanding();

	if (whereIs === null) return null;

	if (location.activeView !== 'game') return null;

	return (
		<Space>
			{Array.from({ length: whereIs.lifes })
				.map((_, i) => i)
				.sort((a, b) => b - a)
				.map(life =>
					life < lifes ? (
						<CardsHeartIcon
							className='animate__animated animate__heartBeat'
							key={`life-${life}`}
							style={{ color: 'red', fontSize: '25px' }}
						/>
					) : (
						<HeartBrokenIcon key={`life-${life}`} style={{ color: 'gray', fontSize: '25px' }} />
					)
				)}
		</Space>
	);
}
