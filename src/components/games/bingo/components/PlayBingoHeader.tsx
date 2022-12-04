import { Button, PageHeader, Popconfirm, Space, Tooltip } from 'antd';
import { PlayBingoHeaderInterface } from '../interfaces/bingo';
import ChooseTemplate from './cms/ChooseTemplate';

export default function PlayBingoHeader(props: PlayBingoHeaderInterface) {
	const { bingoValues, playing, pickedNumber, startGame, endGame, restartGame, dimensions } = props;
	return (
		<PageHeader
			title='Panel de control del Bingo'
			extra={
				<Space>
					{!playing && pickedNumber.value !== 'Hemos finalizado' ? (
						// <Tooltip
						// 	title={
						// 		bingoValues.length < dimensions.minimun_values ? `${dimensions.minimun_values} valores minimo` : ''
						// 	}>
						// 	<Button type='primary' disabled={bingoValues.length < dimensions.minimun_values} onClick={startGame}>
						// 		Iniciar Bingo
						// 	</Button>
						// </Tooltip>
						<ChooseTemplate
							type='start'
							bingoValues={bingoValues}
							playing={playing}
							pickedNumber={pickedNumber}
							startGame={startGame}
							endGame={endGame}
							restartGame={restartGame}
							dimensions={dimensions}
						/>
					) : (
						<>
							<Popconfirm title='Estás seguro de finalizar el BINGO?' onConfirm={endGame}>
								<Button type='primary' danger>
									Finalizar Bingo
								</Button>
							</Popconfirm>

							{/* <Popconfirm title='Estás seguro de reiniciar el BINGO?' onConfirm={restartGame}>
								<Button>Nueva ronda</Button>
							</Popconfirm> */}
							<ChooseTemplate
								type='restart'
								bingoValues={bingoValues}
								playing={playing}
								pickedNumber={pickedNumber}
								startGame={startGame}
								endGame={endGame}
								restartGame={restartGame}
								dimensions={dimensions}
							/>
						</>
					)}
				</Space>
			}
		/>
	);
}
