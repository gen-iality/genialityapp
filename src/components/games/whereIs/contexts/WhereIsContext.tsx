import { ReactNode, createContext, useState, useEffect } from 'react';
import { UseUserEvent } from '@/context/eventUserContext';
import {
	CreatePointDto,
	CreateWhereIsDto,
	Player,
	Point,
	UpdatePointDto,
	UpdatePointsDto,
	UpdateWhereIsDto,
	WhereIs,
} from '../types';
import * as service from '../services';
import { Score } from '../../common/Ranking/types';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';

interface WhereIsContextType {
	whereIs: WhereIs | null;
	loading: boolean;
	partialLoading: boolean;
	points: Point[];
	players: Player[];
	scores: Score[];
	myScore: Score | null;
	// Dynamic
	getWhereIs: () => Promise<void>;
	createWhereIs: (createWhereIsDto: Omit<CreateWhereIsDto, 'event_id'>) => Promise<void>;
	updateWhereIs: (updateWhereIsDto: UpdateWhereIsDto) => Promise<void>;
	deleteWhereIs: () => Promise<void>;
	listenWhereIs: () => () => void;
	// Points
	getPoints: () => Promise<void>;
	createPoint: (createPointDto: CreatePointDto) => Promise<void>;
	updatePoint: (pointId: Point['id'], updatePointDto: UpdatePointDto) => Promise<void>;
	updatePoints: (updatePointsDto: UpdatePointsDto[]) => Promise<void>;
	deletePoint: (pointId: Point['id']) => Promise<void>;
	// Ranking
	getScores: () => Promise<void>;
	rankingListener: () => () => void;
}

export const WhereIsContext = createContext<WhereIsContextType>({} as WhereIsContextType);

interface Props {
	children: ReactNode;
}

export default function WhereIsProvider(props: Props) {
	const [whereIs, setWhereIs] = useState<WhereIs | null>(null);
	const [points, setPoints] = useState<Point[]>([] as Point[]);
	const [players, setPlayer] = useState<Player[]>([] as Player[]);
	const [loading, setLoading] = useState(false);
	const [partialLoading, setPartialLoading] = useState(false);
	const [scores, setScores] = useState<Score[]>([] as Score[]);
	const [myScore, setMyScore] = useState<Score | null>(null);
	// Hooks
	const cUser = UseUserEvent();
	const eventId = cUser?.value?.event_id;

	useEffect(() => {
		const eventId = cUser?.value?.event_id;
		if (eventId && whereIs === null) {
			getWhereIs();
			getPoints();
		}
		const unsubscribe = service.listenWhereIs(eventId, setWhereIs);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (!scores.length) {
			getScores();
		}
		const unsubscribe = rankingListener();
		return () => unsubscribe();
	}, []);

	const getWhereIs = async () => {
		try {
			setLoading(true);
			if (eventId) return;
			const whereIs = await service.get(eventId);
			setWhereIs(whereIs);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const createWhereIs = async (createWhereIsDto: Omit<CreateWhereIsDto, 'event_id'>) => {
		try {
			setLoading(false);
			if (!eventId) return;
			const whereIs = await service.create({ ...createWhereIsDto, event_id: eventId });
			setWhereIs(whereIs);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const updateWhereIs = async (updateWhereIsDto: UpdateWhereIsDto) => {
		try {
			setLoading(false);
			if (!eventId) return;
			const whereIs = await service.update(eventId, updateWhereIsDto);
			setWhereIs(whereIs);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteWhereIs = async () => {
		try {
			setLoading(false);
			if (!eventId) return;
			const deletedWhereIs = await service.remove(eventId);
			if (deletedWhereIs) {
				setWhereIs(null);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const listenWhereIs = () => {
		if (!eventId) return () => {};
		return service.listenWhereIs(cUser.value.event_id, setWhereIs);
	};

	// -------------- Points hooks ----------------- //
	const getPoints = async () => {
		try {
			setPartialLoading(true);
			const points = await service.getPoints(eventId);
			const pointsSorted = points.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
			setPoints(pointsSorted);
		} catch (error) {
			console.log(error);
		} finally {
			setPartialLoading(false);
		}
	};
	const createPoint = async (createPointDto: CreatePointDto) => {
		try {
			setPartialLoading(true);
			await service.createPoint(createPointDto, eventId);
			await getPoints();
		} catch (error) {
			console.log(error);
		} finally {
			setPartialLoading(false);
		}
	};
	const updatePoint = async (pointId: Point['id'], updatePointDto: UpdatePointDto) => {
		try {
			setPartialLoading(true);
			await service.updatePoint(pointId, updatePointDto, eventId);
			await getPoints();
		} catch (error) {
			console.log(error);
		} finally {
			setPartialLoading(false);
		}
	};
	const updatePoints = async (updatePointsDto: UpdatePointsDto[]) => {
		try {
			setPartialLoading(true);
			await service.updatePoints(updatePointsDto, eventId);
			await getPoints();
		} catch (error) {
			console.log(error);
		} finally {
			setPartialLoading(false);
		}
	};
	const deletePoint = async (pointId: Point['id']) => {
		try {
			setPartialLoading(true);
			await service.deletePoint(pointId, eventId);
			await getPoints();
		} catch (error) {
			console.log(error);
		} finally {
			setPartialLoading(false);
		}
	};
	// -------------- Ranking hooks ----------------- //
	const getScores = async () => {
		const players = await service.getScores({ event_id: eventId });
		if (players === null) return;
		const playersFinished = players.filter(player => player.isFinish === true);
		const playersNotFinished = players.filter(player => player.isFinish === false);
		const playersOrderedByDuration = playersFinished.sort((playerA, playerB) => playerA.duration - playerB.duration);
		const scoresFinished = playersOrderedByDuration.map((player, i) => {
			return fromPlayerToScore(player, i + 1);
		});
		const scoresNotFinished = playersNotFinished.map(player => {
			return fromPlayerToScore(player, 0);
		});
		const myScoreWin = scoresFinished.find(score => score.uid === (cUser.value._id as string));
		const myScoreLose = scoresNotFinished.find(score => score.uid === (cUser.value._id as string));
		if (myScoreWin) {
			setMyScore(myScoreWin);
		}
		if (myScoreLose) {
			setMyScore(myScoreLose);
		}
		setScores(scoresFinished);
	};

	const rankingListener = () => {
		return service.getScoresListener(eventId, setScores);
	};

	const values = {
		whereIs,
		loading,
		partialLoading,
		points,
		players,
		scores,
		myScore,
		//
		getWhereIs,
		createWhereIs,
		updateWhereIs,
		deleteWhereIs,
		listenWhereIs,
		//
		getPoints,
		createPoint,
		updatePoint,
		updatePoints,
		deletePoint,
		//
		getScores,
		rankingListener,
	};

	return <WhereIsContext.Provider value={values}>{props.children}</WhereIsContext.Provider>;
}
