import CardsHeartIcon from '@2fd/ant-design-icons/lib/CardsHeart';
import HeartBrokenIcon from '@2fd/ant-design-icons/lib/HeartBroken';
import { Space, Grid, Typography } from 'antd';
import useWhereIs from '../../hooks/useWhereIs';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
import { isMobile } from 'react-device-detect';

const { useBreakpoint } = Grid;

export default function Lifes() {
	const { whereIs } = useWhereIs();
	const {
		whereIsGame: { lifes },
		location,
	} = useWhereIsInLanding();
	const screens = useBreakpoint();

	if (whereIs === null) return null;

	if (location.activeView !== 'game') return null;

	return (
		<>
			{!isMobile ? (
				<Space>
					{Array.from({ length: whereIs.lifes })
						.map((_, i) => i)
						.sort((a, b) => b - a)
						.map((life) =>
							life < lifes ? (
								<CardsHeartIcon key={`life-${life}`} style={{ color: 'red', fontSize: '25px' }} />
							) : (
								<HeartBrokenIcon
									className='animate__animated animate__heartBeat'
									key={`life-${life}`}
									style={{ color: 'gray', fontSize: '25px' }}
								/>
							)
						)}
				</Space>
			) : (
				<Space>
					<Typography.Text strong style={{ color: 'red', fontSize: '25px' }}>
						{lifes}
					</Typography.Text>
					{
						<CardsHeartIcon
							key={`life-${lifes}`}
							className='animate__animated animate__heartBeat'
							style={{ color: 'red', fontSize: '25px' }}
						/>
					}
				</Space>
			)}
		</>
	);
}
