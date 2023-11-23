import { Space, Image, Typography, Button, Card, Row, Grid, Result, Tag } from 'antd';
import { ClockCircleOutlined, FireOutlined, CloseCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import Stages from './Stages';
import ProgressClockIcon from '@2fd/ant-design-icons/lib/ProgressClock';
import ProgressStarIcon from '@2fd/ant-design-icons/lib/ProgressStar';
import ExitRunIcon from '@2fd/ant-design-icons/lib/ExitRun';
import PartyPopperIcon from '@2fd/ant-design-icons/lib/PartyPopper';
import { getCorrectColor } from '@/helpers/utils';
const { useBreakpoint } = Grid;



export default function GameAnnoucement() {
	// lo iba crear para hacer la parte este de que mostrar que gano o perdio pero no me dio tiempo :(
	const { onChangeStatusGame, statusGame, scoreUser, millonaire } = useMillonaireLanding();

	const screens = useBreakpoint();
	const backgroundMillonaire = millonaire.appearance.background_color || '#120754';
	const primaryMillonaire = millonaire.appearance.primary_color || '#FFB500';

  const CASES_ANNOUNCEMENT = {
    TIME_OVER: {
      icon: <ProgressClockIcon style={{color: getCorrectColor(primaryMillonaire)}} />,
      title: '¡Se agotó el tiempo!',
      subTitle:
        'Lo sentimos, pero no contestaste la pregunta antes de que se agotara el tiempo, en otra ocasión será, sin embargo, no olvides revisar el ranking para saber cuál es tu posición.',
    },
    WRONG_ANSWER: {
      icon: <CloseCircleOutlined style={{color: getCorrectColor(primaryMillonaire)}} />,
      title: '¡Respuesta Incorrecta!',
      subTitle:
        'Lo sentimos, pero no contestaste correctamente la pregunta, en otra ocasión será, sin embargo, no olvides revisar el ranking para saber cuál es tu posición.',
    },
    RETIRED: {
      icon: <ExitRunIcon style={{color: getCorrectColor(primaryMillonaire)}} />,
      title: '¡Te retiraste!',
      subTitle:
        'Hemos almacenado tu puntaje acumulado hasta la etapa anterior. No olvides revisar el ranking para saber cuál es tu posición.',
    },
    WIN: {
      icon: <PartyPopperIcon style={{color: getCorrectColor(primaryMillonaire)}} />,
      title: '¡Felicitaciones!',
      subTitle:
        'Lograste superar todas las etapas, obtuviste el máximo puntaje. No olvides revisar el ranking para saber cuál es tu posición.',
    },
  };
	return (
		<Row
			align='middle'
			justify='center'
			style={{
				height: '100%',
			}}>
			<Card
				style={{
					border: 'none',
					backgroundColor: primaryMillonaire,
					backdropFilter: 'blur(8px)',
					width: screens.xs ? '95vw' : '45vw',
				}}>
				<Result
					icon={CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].icon}
					title={
						<Typography.Title style={{ color: getCorrectColor(primaryMillonaire) }} level={2}>
							{CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].title}
						</Typography.Title>
					}
					subTitle={
						<>
							<Typography.Paragraph style={{ color: getCorrectColor(primaryMillonaire) }}>
								{CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].subTitle}
							</Typography.Paragraph>

							<Typography.Title level={4}>
								<Space style={{ color: getCorrectColor(primaryMillonaire) }}>
									Puntaje:
									<Tag
										icon={<ProgressStarIcon style={{ fontSize: '20px' }} />}
										color={backgroundMillonaire}
										style={{ fontSize: '20px', padding: '10px 10px', color: getCorrectColor(backgroundMillonaire) }}>
										{scoreUser.score}
									</Tag>
								</Space>
							</Typography.Title>
						</>
					}
					extra={
						<Space>
							<Button style={{backgroundColor:backgroundMillonaire, color:getCorrectColor(backgroundMillonaire), border:'none'}} size='large' type='primary' onClick={() => onChangeStatusGame('GAME_OVER')}>
								Ir al Ranking
							</Button>
							<Button style={{backgroundColor:backgroundMillonaire, color:getCorrectColor(backgroundMillonaire), border:'none'}} size='large' onClick={() => onChangeStatusGame('NOT_STARTED')}>
								Ir al Menu
							</Button>
						</Space>
					}
				/>
			</Card>
		</Row>
	);
}
