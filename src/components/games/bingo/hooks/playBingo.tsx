import { useCallback, useState } from 'react';
import { DispatchMessageService } from '@/context/MessageService';
import {
	BingoByUserInterface,
	BingoDataInterface,
	BingoValuesAddStateInterface,
	BingoWinnerOrLoserInterface,
	DataFirebaseBingoInterface,
	EndGameInterface,
	NotificationItemInterface,
	PickedNumberInterface,
	RestartGameInterface,
	StartGameInterface,
	Template,
	ValidarBingoInterface,
} from '../interfaces/bingo';
import {
	addWinnerBadgeToBingoNotification,
	deleteSpecificBingoNotification,
	deleteBingoNotifications,
	deleteStateOfBingo,
	saveCurrentStateOfBingo,
	createBingoGame,
	updateBingoGame,
	deleteBingoGame,
} from '../services';
import { getCartonBingo } from '../services';
import { bingoWinnerOrLoser } from '../functions';
import { notification } from 'antd';
import useBingoContext from './useBingoContext';

const playBingo = () => {
	const [bingoData, setBingoData] = useState<string[]>([]);
	const [pickedNumber, setPickedNumber] = useState<PickedNumberInterface>({
		type: 'text',
		value: 'Iniciemos un nuevo Bingo',
	});
	const [playing, setPlaying] = useState<boolean>(false);
	const [inputValidate, setInputValidate] = useState<string>('');
	const [listValidate, setListValidate] = useState<BingoDataInterface[]>([]);
	const [disableBallotDrawButton, setDisableBallotDrawButton] = useState<boolean>(false);
	const { templateSelected } = useBingoContext();
	let dataFirebaseBingoInitialState: DataFirebaseBingoInterface = {
		template: templateSelected,
		bingoData: [],
		currentValue: {
			type: '',
			value: '',
		},
		demonstratedBallots: [],
		startGame: true,
	};

	const initPlayBingo = ({ event, dataFirebaseBingo, bingoValues, dimensions }: BingoValuesAddStateInterface) => {
		if (dataFirebaseBingo.startGame) {
			startBingo({ event, dataFirebaseBingo, bingoValues, dimensions });
			setPickedNumber({
				type: dataFirebaseBingo?.currentValue?.type === '' ? 'text' : dataFirebaseBingo?.currentValue?.type,
				value: dataFirebaseBingo?.currentValue?.value === '' ? '¡Preparados!' : dataFirebaseBingo?.currentValue?.value,
			});
			initializingBingoValues({ dataFirebaseBingo, bingoValues, dimensions });
		}
	};

	const initializingBingoValues = ({ dataFirebaseBingo, bingoValues }: BingoValuesAddStateInterface) => {
		if (dataFirebaseBingo.bingoData.length > 0) {
			setListValidate(dataFirebaseBingo.bingoData);
			return dataFirebaseBingo.bingoData;
		}

		return bingoValues.map((bingoValue: any, index: number) => {
			return { ...bingoValue, active: false, index };
		});
	};

	const validarBingo = async ({ manualValidationId, userNotification, event, dimensions }: ValidarBingoInterface) => {
		DispatchMessageService({
			type: 'loading',
			key: 'loading',
			msj: 'Validando la informacion...',
			action: 'show',
		});
		const findUser = async (manualValidationId: string | undefined, userNotification: any) => {
			let user: NotificationItemInterface | undefined = undefined;
			user = userNotification;
			if (!userNotification && manualValidationId !== undefined) {
				const userBinngo: BingoByUserInterface = await getCartonBingo(manualValidationId);
				if (!userBinngo) return undefined;
				let values_ballot: string[] = [];
				let values_bingo_card: string[] = [];
				userBinngo.bingo_card.values_bingo_card.forEach((value: any) => {
					values_ballot.push(value.ballot_value.value);
					values_bingo_card.push(value.carton_value.value);
				});
				user = {
					cardId: manualValidationId,
					names: userBinngo?.name_owner,
					values_ballot,
					values_bingo_card,
					time: new Date(),
					hasWon: false,
				};
				return user;
			}
			return user ? user : undefined;
		};
		/* Checking if the user exists. */
		const user: any = await findUser(manualValidationId, userNotification);

		if (!user) {
			notification.error({ message: 'El código ingresado no es válido' });
			return false;
		}

		let ballotsToValidate = listValidate.filter((ballot: any) => ballot.active === true);
		let ballotValue: any = [];
		let ballotValueUser = [...user?.values_ballot];
		ballotsToValidate.forEach((ballot: any) => {
			ballotValue.push(ballot.ballot_value.value);
		});
		/* Checking if the user has all the ballots. */
		// Here must be function validate
		const template = templateSelected?.index_to_validate;
		if (!template) return console.error('Template missed');

		const getValuesToValidate = (template: Template['index_to_validate'], userBallots: any[]) => {
			return template.map(value => userBallots[value]);
		};

		const valuesToValidate = getValuesToValidate(template, ballotValueUser);

		console.log('ballotValueUser', ballotValueUser);
		console.log('ballotValue', ballotValue);
		console.log('valuesToValidate', valuesToValidate);
    // TODO: Review
		if (ballotValue.length < ballotValueUser.length) {
			notification.error({ message: 'El usuario no tiene todas las balotas' });
			// return false;
		}

		const allValuesPlayed = valuesToValidate.every(value => ballotValue.includes(value));

    console.log('allValuesPlayed', allValuesPlayed)

    if (allValuesPlayed) {
      const winnerConfig: BingoWinnerOrLoserInterface = {
				title: `Feliciades el usuario ${user?.names} ha ganado el Bingo`,
				type: 'success',
				onOk: async () => {
					if (!user?._id) return;
					await addWinnerBadgeToBingoNotification({
						event,
						notificationId: user?._id,
					});
				},
			};

			bingoWinnerOrLoser(winnerConfig);
      return true;
    }


		// if (ballotValueUser.every((element: any) => ballotValue.includes(element))) {
		// 	const winnerConfig: BingoWinnerOrLoserInterface = {
		// 		title: `Feliciades el usuario ${user?.names} ha ganado el Bingo`,
		// 		type: 'success',
		// 		onOk: async () => {
		// 			if (!user?._id) return;
		// 			await addWinnerBadgeToBingoNotification({
		// 				event,
		// 				notificationId: user?._id,
		// 			});
		// 		},
		// 	};

		// 	bingoWinnerOrLoser(winnerConfig);
		// 	return true;
		// }

		const losserConfig: BingoWinnerOrLoserInterface = {
			title: `El usuario ${user?.names} no ha ganado el Bingo`,
			type: 'warning',
			onOk: async () => {
				await deleteSpecificBingoNotification({
					event,
					notificationId: user?._id,
				});
			},
		};
		bingoWinnerOrLoser(losserConfig);

		return false;
	};

	const generateRandomBallot = useCallback(
		({ demonstratedBallots, event }) => {
			if (playing) {
				let availableNumbers = new Array();
				let newList = new Array();
				availableNumbers = [
					...bingoData.reduce((accumulator: number[], item: any) => {
						if (!item.active) accumulator.push(item.index);
						return accumulator;
					}, []),
				];

				const rand = Math.floor(Math.random() * availableNumbers.length);

				// current ballot selected
				const pickedBallotValue: number = availableNumbers[rand];

				/** New instance of array with updated values */
				newList = [...bingoData];
				setListValidate(newList);
				const asigneNewState: { active: boolean } = newList[pickedBallotValue];

				// current ballot value
				const currentBallotValue = newList.filter((item: any) => {
					return item.index === pickedBallotValue;
				});

				const currentValueString =
					currentBallotValue.length > 0 ? currentBallotValue[0].ballot_value.value : 'Hemos finalizado';
				const currentTypeString = currentBallotValue.length > 0 ? currentBallotValue[0].ballot_value.type : '';

				const pickeNumberData = {
					type: currentTypeString,
					value: currentValueString,
				};
				setPickedNumber({
					type: currentTypeString,
					value: currentValueString,
				});
				if (pickedBallotValue === undefined) {
					setPlaying(false);
				}
				if (!asigneNewState) {
					/* Saving the current state of the bingo in the database. */
					saveCurrentStateOfBingo({
						event,
						newList,
						currentValue: pickeNumberData,
						demonstratedBallots,
						startGame: true,
					});
					return;
				}
				demonstratedBallots.push(pickeNumberData);
				asigneNewState.active = true;
				/* Saving the current state of the bingo in the database. */
				saveCurrentStateOfBingo({
					event,
					newList,
					currentValue: pickeNumberData,
					demonstratedBallots,
					startGame: true,
				});
			}
		},
		[bingoData, playing]
	);

	const startBingo = ({ event, dataFirebaseBingo, bingoValues, dimensions }: StartGameInterface) => {
		if (bingoValues.length < 5) {
			DispatchMessageService({
				type: 'error',
				key: 'error',
				msj:
					'No hay suficientes valores para jugar, por favor agregue mas valores ' +
					(dimensions!.minimun_values - bingoValues.length) +
					' valores faltantes como mínimo',
				action: 'show',
			});
			return;
		}
		console.log('Start BingoGame!');
		// TODO: Choose Template
		console.log('Choose template');
		if (!event?._id) return console.log('eventId missed');
		createBingoGame(event._id, {
			template: templateSelected,
			bingoData: dataFirebaseBingo?.bingoData,
			currentValue: dataFirebaseBingo?.currentValue,
			demonstratedBallots: dataFirebaseBingo?.demonstratedBallots,
			startGame: true,
		});
		// saveCurrentStateOfBingo({
		// 	event,
		// 	newList: dataFirebaseBingo?.bingoData,
		// 	currentValue: dataFirebaseBingo?.currentValue,
		// 	demonstratedBallots: dataFirebaseBingo?.demonstratedBallots,
		// 	startGame: true,
		// });
		setBingoData(initializingBingoValues({ dataFirebaseBingo, bingoValues }));
		setPlaying(true);
		setPickedNumber({ type: '', value: '¡Preparados!' });
	};

	const endBingo = ({ event, bingoValues }: EndGameInterface) => {
		console.log('End BingoGame!');
		let dataFirebaseBingo = dataFirebaseBingoInitialState;
		if (!event?._id) return console.log('eventId missed');
		createBingoGame(event._id, {
			template: templateSelected,
			bingoData: [],
			currentValue: {
				type: '',
				value: '',
			},
			demonstratedBallots: [],
			startGame: true,
		});
		// updateBingoGame(event._id, {
		// 	template: templateSelected,
		// 	bingoData: [],
		// 	currentValue: {
		// 		type: '',
		// 		value: '',
		// 	},
		// 	demonstratedBallots: [],
		// 	startGame: true,
		// });
		// saveCurrentStateOfBingo({
		// 	event,
		// 	newList: [],
		// 	currentValue: {
		// 		type: '',
		// 		value: '',
		// 	},
		// 	demonstratedBallots: [],
		// 	startGame: true,
		// });
		setBingoData(initializingBingoValues({ dataFirebaseBingo, bingoValues }));
		setPlaying(false);
		setPickedNumber({ type: '', value: 'Iniciemos un nuevo Bingo' });
		deleteBingoGame(event._id);
		// deleteStateOfBingo({ event });
		deleteBingoNotifications({ event });
		setListValidate([]);
	};

	const restartBingo = ({ event, bingoValues }: RestartGameInterface) => {
		let dataFirebaseBingo = dataFirebaseBingoInitialState;
		if (!event?._id) return console.log('eventId missed');
		// TODO: Choose Template
		console.log('Choose template');
		updateBingoGame(event._id, {
			template: templateSelected,
			bingoData: [],
			currentValue: {
				type: '',
				value: '',
			},
			demonstratedBallots: [],
			startGame: true,
		});
		// saveCurrentStateOfBingo({
		// 	event,
		// 	newList: [],
		// 	currentValue: {
		// 		type: '',
		// 		value: '',
		// 	},
		// 	demonstratedBallots: [],
		// 	startGame: true,
		// });
		setBingoData(initializingBingoValues({ dataFirebaseBingo, bingoValues }));
		setPlaying(true);
		setPickedNumber({ type: '', value: '¡Preparados!' });
		setListValidate([]);
		deleteBingoNotifications({ event });
	};

	return {
		bingoData,
		setBingoData,
		pickedNumber,
		setPickedNumber,
		playing,
		setPlaying,
		inputValidate,
		setInputValidate,
		listValidate,
		setListValidate,
		startBingo,
		restartBingo,
		endBingo,
		initializingBingoValues,
		initPlayBingo,
		validarBingo,
		generateRandomBallot,
		disableBallotDrawButton,
		setDisableBallotDrawButton,
	};
};
export default playBingo;
