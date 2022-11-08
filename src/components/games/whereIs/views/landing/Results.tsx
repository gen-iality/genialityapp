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
			<Col xs={24} sm={24} md={14} lg={14} xl={14} xxl={14}>
				<Result
					icon={player?.isFinish ? dataResult.winner.icon : dataResult.loser.icon}
					title={player?.isFinish ? dataResult.winner.title : dataResult.loser.title}
					subTitle={player?.isFinish ? dataResult.winner.msg : dataResult.loser.msg}
					extra={<DataTimerResult time={player?.duration} won={player?.isFinish ?? false} />}
				/>
			</Col>

			<Col xs={24} sm={24} md={10} lg={10} xl={10} xxl={10}>
				<Card bodyStyle={{ padding: '10px' }}>
					<Ranking />
				</Card>
			</Col>
		</Row>
	);
}
