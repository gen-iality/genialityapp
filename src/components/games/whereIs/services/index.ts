import { DispatchMessageService } from '@/context/MessageService';
import { firestore } from '@/helpers/firebase';
import { Score } from '../../common/Ranking/RankingMyScore';
import { CreatePlayerDto, Player, Point, WhereIs } from '../types';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';

export const get = async (eventId: string): Promise<WhereIs | null> => {
	try {
		const whereIs = await getWhereIs(eventId);
		const points = await getWhereIsPoints(eventId);
		if (whereIs === null) return null;
		return { ...whereIs, points };
	} catch (error) {
		DispatchMessageService({
			type: 'error',
			msj: 'Error al obtener la dinamica',
			action: 'show',
		});
		return null;
	}
};

export const getWhereIs = async (eventId: string) => {
	const whereIsDoc = await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.get();
	if (!whereIsDoc.exists) return null;
	return whereIsDoc.data() as WhereIs;
};

export const getWhereIsListener = (
	eventId: string,
	setWhereIs: React.Dispatch<React.SetStateAction<WhereIs | null>>
) => {
	const unsubscribe = firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.onSnapshot(doc => {
			if (!doc.exists) {
				console.log('Document doesnt exists yet');
			} else {
				setWhereIs(prev => ({ ...prev, ...(doc.data() as WhereIs) }));
			}
		});
	return unsubscribe;
};

export const getWhereIsPoints = async (eventId: string): Promise<Point[]> => {
	const pointsDoc = await firestore
		.collection('whereIsByEvent')
		.doc(eventId)
		.collection('points')
		.get();
	if (pointsDoc.empty) return [];
	const points = pointsDoc.docs.map(doc => doc.data());
	if (points === null) return [];
	return points as Point[];
};

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

export const getScoresListener = (event_id: string, setScores: React.Dispatch<React.SetStateAction<Score[]>>) => {
	console.log('Se inicializa el listener');
	console.log(event_id);
	const unsubscribe = firestore
		.collection('whereIsByEvent')
		.doc(event_id)
		.collection('players')
		.onSnapshot(
			playersDoc => {
				if (playersDoc.empty) {
					console.log('playersDoc is empty');
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