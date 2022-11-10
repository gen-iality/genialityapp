import Ranking from '@/components/games/common/Ranking';
import { UseEventContext } from '@/context/eventContext';
import { Card, Col, Row } from 'antd';
import useSharePhoto from '../../hooks/useSharePhoto';
import { SharePhoto } from '../../types';

// const myScore = {
// 	uid: '636c0c6d96121d4a4e3995a4',
// 	imageProfile:
// 		'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
// 	score: '100',
// 	name: 'Juan Camayo',
// 	index: 1,
// };

// const scores = [
// 	{
// 		uid: '636c0c6d96121d4a4e3995a4',
// 		imageProfile:
// 			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
// 		score: '100',
// 		name: 'Juan Camayo',
// 		index: 1,
// 	},
// 	{
// 		uid: '636bb6b521b48d56a8144709',
// 		imageProfile:
// 			'https://firebasestorage.googleapis.com/v0/b/eviusauthdev.appspot.com/o/images%2F1664828271521.png?alt=media&token=dae70e80-45ea-4daa-9523-ed9bd0ffdf67',
// 		score: '100',
// 		name: 'Juan Camayo',
// 		index: 2,
// 	},
// ];

// const type: 'time' | 'points' = 'points';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabResults(props: Props) {
	// const cEvent = UseEventContext();
	const { scores, myScore } = useSharePhoto();
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
