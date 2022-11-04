import { UseUserEvent } from '@/context/eventUserContext';
import { DispatchMessageService } from '@/context/MessageService';
import { useContext, useEffect } from 'react';
import { WhereIsInLandingContext, WhereIsLocationView } from '../contexts/WhereIsInLandingContext';
import { Player, PointInGame } from '../types';
import useWhereIs from './useWhereIs';

export default function useWhereIsInLanding() {
	const cUser = UseUserEvent();
	const context = useContext(WhereIsInLandingContext);

	if (context === undefined) {
		throw new Error('Debe estar dentro del WhereIsInLandingProvider');
	}

	const { whereIs } = useWhereIs();

	useEffect(() => {
		if (whereIs === null) return;
		const points = whereIs.points.map(point => ({ ...point, stroke: undefined, isFound: false }));
		setWhereIsGame(prev => ({
			...prev,
			lifes: whereIs.lifes,
			dynamic_id: whereIs.id,
			event_user_id: '',
			user_name: '',
			picture: '',
			points,
		}));
	}, []);

	const { location, setLocation, whereIsGame, setWhereIsGame, player, setPlayer } = context;

	// useEffect(() => {
	// 	if (whereIsGame.points.every(point => point.isFound === true)) {
	// 		// console.log(whereIsGame.points.every(point => point.isFound === true));
	// 		// console.log('Player');
	// 		if (whereIs === null) return;
	// 		setWhereIsGame(prev => ({
	// 			...prev,
	// 			isFinish: true,
	// 			won: true,
	// 		}));
	// 		const player: Player = {
	// 			created_at: new Date().toISOString(),
	// 			updated_at: new Date().toISOString(),
	// 			isFinish: true,
	// 			duration: whereIsGame.duration,
	// 			dynamic_id: whereIs.id,
	// 			event_user_id: cUser.value._id,
	// 			user_name: cUser.value.names,
	// 			picture: cUser.value.picture,
	// 		};
	// 		console.log(player);
	// 		goTo('results');
	// 	}
	// }, [whereIsGame.points]);

	// useEffect(() => {
	// 	if (whereIsGame.won && player === null) {
	// 		// console.log(cUser);
	// 		// console.log('Ganaste');
	// 		if (whereIs === null) return;
	// 		const player: Player = {
	// 			created_at: new Date().toISOString(),
	// 			updated_at: new Date().toISOString(),
	// 			isFinish: true,
	// 			duration: whereIsGame.duration + 1,
	// 			dynamic_id: whereIs.id,
	// 			event_user_id: cUser.value._id,
	// 			user_name: cUser.value.user.names,
	// 			picture: cUser.value.user.picture,
	// 		};
	// 		setPlayer(player);
	// 		console.log(player);
	// 	}
	// }, [whereIsGame.won, player]);

	const goTo = (location: WhereIsLocationView) => {
		setLocation(prev => ({ ...prev, activeView: location }));
	};

	const wrongPoint = () => {
		console.log(cUser);
		if (!whereIsGame.lifes) return;
		if (whereIsGame.lifes - 1 === 0) {
			setWhereIsGame(prev => ({
				...prev,
				won: true,
				isFinish: true,
			}));
			loseGame();
		}
		setWhereIsGame(prev => ({ ...prev, lifes: prev.lifes > 0 ? prev.lifes - 1 : 0 }));
		DispatchMessageService({ type: 'error', action: 'show', msj: 'Ups!, perdiste una vida 💔' });
	};

	const foundPoint = (id: PointInGame['id']) => {
		// Verify lifes
		if (!whereIsGame.lifes) return;
		const pointIndex = whereIsGame.points.findIndex(point => point.id === id);
		// Verify if point is found
		if (whereIsGame.points[pointIndex].isFound) return;
		const totalPoints = whereIsGame.points.length;
		const pointsFound = whereIsGame.points.reduce((total, current) => {
			if (current.isFound) {
				total += 1;
			}
			return total;
		}, 0);
		if (pointsFound + 1 === totalPoints) {
			setWhereIsGame(prev => ({
				...prev,
				won: true,
				isFinish: true,
			}));
			winGame();
		}
		// Create new Point
		const newPoint = { ...whereIsGame.points[pointIndex], stroke: 'red', isFound: true };
		const newPoints = whereIsGame.points.map(point => (point.id === id ? newPoint : point));
		setWhereIsGame(prev => ({ ...prev, points: newPoints }));
		DispatchMessageService({ type: 'success', action: 'show', msj: 'Lo encontraste! Sigue asi!' });
	};

	const setTimer = (count: number) => {
		setWhereIsGame(prev => ({
			...prev,
			duration: count,
		}));
	};

	const restartGame = () => {
		setWhereIsGame(prev => ({
			...prev,
			duration: 0,
			isFinish: false,
			won: false,
		}));
	};

	const winGame = () => {
		if (whereIs === null) return;
		const player: Player = {
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			isFinish: true,
			duration: whereIsGame.duration + 1,
			dynamic_id: whereIs.id,
			event_user_id: cUser.value._id,
			user_name: cUser.value.user.names,
			picture: cUser.value.user.picture,
		};
		setPlayer(player);
		console.log('Ganaste');
		console.log(player);
	};

	const loseGame = () => {
		if (whereIs === null) return;
		const player: Player = {
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			isFinish: false,
			duration: whereIsGame.duration + 1,
			dynamic_id: whereIs.id,
			event_user_id: cUser.value._id,
			user_name: cUser.value.user.names,
			picture: cUser.value.user.picture,
		};
		console.log('Perdiste');
		console.log(player);
	};

	return { location, goTo, whereIsGame, wrongPoint, foundPoint, setTimer, winGame };
}
