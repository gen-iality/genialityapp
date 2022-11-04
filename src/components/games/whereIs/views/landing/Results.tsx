import { Card, Col, Image, Result, Row, Space, Tag, Typography } from 'antd';
import HeartBrokenIcon from '@2fd/ant-design-icons/lib/HeartBroken';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
import Ranking from '@/components/games/common/Ranking';
import { parseTime } from '../../utils/parseTime';

const DataTimerResult = ({ time = 0, won }: { time?: number; won: boolean }) => {
	return (
		<Tag
			style={{ padding: '5px 10px', fontSize: '16px' }}
			icon={<TimerOutlineIcon style={{ fontSize: '16px' }} />}
			color={won ? 'success' : 'error' /* Si gano 'success', si perdio 'error' */}>
			{parseTime(time)}
		</Tag>
	);
};

export default function Results() {
	const {
		whereIsGame: { won },
		player,
	} = useWhereIsInLanding();
	const dataResult = {
		winner: {
			icon: ' ',
			title: '¡Felicitaciones!',
			msg:
				'Has logrado el objetivo de la dinámica, esperamos te hayas divertido. Hemos registrado tu tiempo correctamente.',
			// extra: <DataTimerResult time={player?.duration && 0} />,
		},
		loser: {
			icon: <HeartBrokenIcon style={{ color: 'gray' }} />,
			title: 'Lo sentimos',
			msg:
				'Te quedaste sin vidas para continuar con la búsqueda, esperamos te hayas divertido, en otra oportunidad será.',
			// extra: <DataTimerResult time={player?.duration && 0} />,
		},
	};
	return (
		<Row justify='center' align='middle'>
			<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
				<Result
					icon={won ? dataResult.winner.icon : dataResult.loser.icon}
					title={won ? dataResult.winner.title : dataResult.loser.title}
					subTitle={won ? dataResult.winner.msg : dataResult.loser.msg}
					extra={<DataTimerResult time={player?.duration} won={won} />}
				/>
			</Col>
			<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
				<Card>
					<Ranking />
				</Card>
			</Col>
		</Row>
	);
}
