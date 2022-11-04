import { DispatchMessageService } from '@/context/MessageService';
import { useContext, useEffect } from 'react';
import { WhereIsInLandingContext, WhereIsLocationView } from '../contexts/WhereIsInLandingContext';
import { PointInGame } from '../types';
import useWhereIs from './useWhereIs';

export default function useWhereIsInLanding() {
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

	const { location, setLocation, whereIsGame, setWhereIsGame } = context;

	useEffect(() => {
		// if (whereIsGame.lifes === 0) {
		// 	goTo('results');
		// }
	}, [whereIsGame.lifes]);

	const goTo = (location: WhereIsLocationView) => {
		setLocation(prev => ({ ...prev, activeView: location }));
	};

	const wrongPoint = () => {
		if (!whereIsGame.lifes) return;
		setWhereIsGame(prev => ({ ...prev, lifes: prev.lifes > 0 ? prev.lifes - 1 : 0 }));
		DispatchMessageService({ type: 'error', action: 'show', msj: 'Ups!, perdiste una vida 💔' });
	};

	const foundPoint = (id: PointInGame['id']) => {
		if (!whereIsGame.lifes) return;
		const pointIndex = whereIsGame.points.findIndex(point => point.id === id);
		const newPoint = { ...whereIsGame.points[pointIndex], stroke: 'red', isFound: true };
		const newPoints = whereIsGame.points.map(point => (point.id === id ? newPoint : point));
		setWhereIsGame(prev => ({ ...prev, points: newPoints }));
		DispatchMessageService({ type: 'success', action: 'show', msj: 'Lo encontraste! Sigue asi!' });
	};

	return { location, goTo, whereIsGame, wrongPoint, foundPoint };
}
