import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { Score } from '../../common/Ranking/types';
import {
	CreatePlayerDto,
	CreatePointDto,
	CreateWhereIsDto,
	Player,
	Point,
	UpdatePointDto,
	UpdatePointsDto,
	UpdateWhereIsDto,
	WhereIs,
} from '../types';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';
import { collection, deleteDoc, getDocs } from 'firebase/firestore';

// export const get = async (eventId: string): Promise<WhereIs | null> => {
// 	try {
// 		const whereIs = await getWhereIs(eventId);
// 		const points = await getWhereIsPoints(eventId);
// 		if (whereIs === null) return null;
// 		return { ...whereIs, points };
// 	} catch (error) {
// 		DispatchMessageService({
// 			type: 'error',
// 			msj: 'Error al obtener la dinamica',
// 			action: 'show',
// 		});
// 		return null;
// 	}
// };

export const get = async (eventId: string) => {
	const whereIsDoc = await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.get();
	if (!whereIsDoc.exists) return null;
	return { _id: whereIsDoc.id, ...whereIsDoc.data() } as WhereIs;
};

export const create = async (createWhereIsDto: CreateWhereIsDto): Promise<WhereIs | null> => {
	try {
		const newWhereIs: Omit<WhereIs, '_id'> = {
			event_id: createWhereIsDto.event_id,
			title: createWhereIsDto.title,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			published: false,
			instructions: '',
			active: false,
			lifes: 1,
			game_image: '',
			game_image_width: 0,
			game_image_height: 0,
		};
		await firestore
			.collection('whereIsByEvent')
			.doc(createWhereIsDto.event_id)
			.set(newWhereIs);
		return await get(createWhereIsDto.event_id);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al crear la dinamica', action: 'show' });
		return null;
	}
};

export const update = async (
	// whereIsId: WhereIs['_id'],
	eventId: string,
	updateWhereIsDto: UpdateWhereIsDto
): Promise<WhereIs | null> => {
	try {
		const response = {
			...updateWhereIsDto,
			updated_at: new Date().toISOString(),
		};
		await firestore
			.collection('whereIsByEvent')
			.doc(eventId)
			.update(response);
		return await get(eventId);
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al actualizar la dinamica', action: 'show' });
		return null;
	}
};

export const remove = async (eventId: string) => {
	try {
		await firestore
			.collection('whereIsByEvent')
			.doc(eventId)
			.delete();
		return true;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al eliminar la dinamica', action: 'show' });
		return null;
	}
};

export const listenWhereIs = (eventId: string, setWhereIs: React.Dispatch<React.SetStateAction<WhereIs | null>>) => {
	const unsubscribe = firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.onSnapshot(doc => {
			if (!doc.exists) {
				// console.log('Document doesnt exists yet');
			} else {
				setWhereIs(prev => ({ ...prev, ...({ _id: doc.id, ...doc.data() }) as WhereIs }));
			}
		});
	return unsubscribe;
};

// -------------- Points services ----------------- //
export const getPoints = async (eventId: string): Promise<Point[]> => {
	const pointsDoc = await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.collection('points')
		.get();
	if (pointsDoc.empty) return [];
	const points = pointsDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	if (points === null) return [];
	return points as Point[];
};

export const createPoint = async (createPointDto: CreatePointDto, eventId: string) => {
	const newPoint: Omit<Point, 'id'> = {
		...createPointDto,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
	await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.collection('points')
		.doc()
		.set(newPoint);
};

export const createPoints = async (createPointsDto: CreatePointDto[], eventId: string) => {
	await Promise.all(createPointsDto.map(async createPointDto => {
		const newPoint: Omit<Point, 'id'> = {
			...createPointDto,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		await firestore
			.collection('whereIsByEvent')
			.doc(eventId)
			.collection('points')
			.doc()
			.set(newPoint);

	}))
};

export const updatePoint = async (pointId: Point['id'], updatePointDto: UpdatePointDto, eventId: string) => {
	const updatedPoint = {
		...updatePointDto,
		updated_at: new Date().toISOString(),
	};
	await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.collection('points')
		.doc(pointId)
		.update(updatedPoint);
};

export const updatePoints = async (updatePointsDto: UpdatePointsDto[], eventId: string) => {
	await Promise.all(updatePointsDto.map(async updatePointDto => {
		const { id, ...rest } = updatePointDto
		const updatedPoint = {
			...rest,
			updated_at: new Date().toISOString(),
		};
		await firestore
			.collection('whereIsByEvent')
			.doc(eventId)
			.collection('points')
			.doc(id)
			.update(updatedPoint);
	}))
};

export const deletePoint = async (pointId: Point['id'], eventId: string) => {
	await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.collection('points')
		.doc(pointId)
		.delete();
	return true;
};

// -------------- Players services ----------------- //
export const createPlayer = async (createPlayerDto: CreatePlayerDto) => {
	try {
		const { event_id, event_user_id, ...rest } = createPlayerDto;
		await firestore
			.collection('whereIsByEvent')
			.doc(createPlayerDto.event_id)
			.collection('players')
			.doc(createPlayerDto.event_user_id)
			.set({ ...rest, event_user_id });
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};

interface GetPlayerDto {
	event_id: string;
	event_user_id: string;
}

export const getPlayer = async (getPlayerDto: GetPlayerDto) => {
	try {
		const { event_id, event_user_id } = getPlayerDto;
		const playerDoc = await firestore
			.collection('whereIsByEvent')
			.doc(event_id)
			.collection('players')
			.doc(event_user_id)
			.get();
		if (!playerDoc.exists) return null;
		return playerDoc.data() as Player;
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};

interface GetScoreDto {
	event_id: string;
}

export const getScores = async (getScoreDto: GetScoreDto) => {
	try {
		const { event_id } = getScoreDto;
		const playersDoc = await firestore
			.collection('whereIsByEvent')
			.doc(event_id)
			.collection('players')
			.get();
		if (playersDoc.empty) return [];
		const players = playersDoc.docs.map(doc => doc.data());
		if (players === null) return [];
		return players as Player[];
	} catch (error) {
		DispatchMessageService({ type: 'error', msj: 'Error al obtener la dinamica', action: 'show' });
		return null;
	}
};

export const restoreScores = async (getScoreDto: GetScoreDto) => {
  const { event_id } = getScoreDto;
  const playersCollection = collection(firestore, 'whereIsByEvent', event_id, 'players');

  try {
    const querySnapshot = await getDocs(playersCollection);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    return {
      error: false,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
};

export const getScoresListener = (event_id: string, setScores: React.Dispatch<React.SetStateAction<Score[]>>) => {
	// console.log('Se inicializa el listener');
	// console.log(event_id);
	const unsubscribe = firestore
		.collection('whereIsByEvent')
		.doc(event_id)
		.collection('players')
		.onSnapshot(
			playersDoc => {
				if (playersDoc.empty) {
				} else {
					const players = playersDoc.docs.map(doc => doc.data()) as Player[];
					const playersFinished = players.filter(player => player.isFinish === true);
					const playersOrderedByDuration = playersFinished.sort(
						(playerA, playerB) => playerA.duration - playerB.duration
					);
					const scoresFinished = playersOrderedByDuration.map((player, i) => {
						return fromPlayerToScore(player, i + 1);
					});
					setScores(scoresFinished);
				}
			},
			onError => {
				console.log(onError);
			}
		);
	return unsubscribe;
};
