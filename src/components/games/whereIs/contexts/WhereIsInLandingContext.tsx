import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { createContext, ReactNode, useEffect, useState } from 'react';
import useWhereIs from '../hooks/useWhereIs';
import { Player, PointInGame, WhereIsGame } from '../types';
import * as services from '../services';
import { DispatchMessageService } from '@/context/MessageService';
import { fromPlayerToScore } from '../utils/fromPlayerToScore';

export type WhereIsLocationView = 'introduction' | 'game' | 'results';

export interface WhereIsLocation {
  activeView: WhereIsLocationView;
  views: string[];
}

interface WhereIsInLandingType {
  location: WhereIsLocation;
  setLocation: React.Dispatch<React.SetStateAction<WhereIsLocation>>;
  whereIsGame: WhereIsGame;
  setWhereIsGame: React.Dispatch<React.SetStateAction<WhereIsGame>>;
  player: Player | null;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  goTo: any
  wrongPoint: any
  foundPoint: any
  setTimer: any
  winGame: any
  getPlayer: any
  getScores: any
}

export const WhereIsInLandingContext = createContext<WhereIsInLandingType>({} as WhereIsInLandingType);

const initialLocation: WhereIsLocation = {
  activeView: 'introduction',
  views: ['introduction', 'game', 'results'],
};

const initialWhereIsGame: WhereIsGame = {
  // _id: '',
  duration: 0,
  isFinish: false,
  dynamic_id: '',
  event_user_id: '',
  picture: '',
  user_name: '',
  won: false,
  lifes: 0,
  points: [],
};

interface Props {
  children: ReactNode;
}

export default function WhereIsInLandingProvider(props: Props) {
  const [location, setLocation] = useState<WhereIsLocation>(initialLocation);
  const [whereIsGame, setWhereIsGame] = useState<WhereIsGame>(initialWhereIsGame);
  const [player, setPlayer] = useState<Player | null>(null);

  // Hooks
  const cUser = UseUserEvent();
  const cEvent = UseEventContext();
  const { whereIs, points, getWhereIs, getPoints } = useWhereIs();

  useEffect(() => {
    if (!whereIs) {
      getWhereIs()
      getPoints()
    } else {
      const pointsToShow = points.map(point => ({ ...point, stroke: undefined, isFound: false }));
      setWhereIsGame(prev => ({
        ...prev,
        lifes: whereIs.lifes,
        dynamic_id: whereIs._id,
        event_user_id: '',
        user_name: '',
        picture: '',
        points: pointsToShow,
      }));
      verifyPlayer();
    };
  }, []);

  // useEffect(() => {
  //   console.log('initialState')
  //   console.log('whereIs -> whereIsGame', whereIsGame)
  //   console.log('whereIs -> points', points)
  //   console.log('whereIs -> whereIs', whereIs)
  // }, [])

  // useEffect(() => {
  //   console.log('some change')
  //   console.log('whereIs -> whereIsGame', whereIsGame)
  //   console.log('whereIs -> points', points)
  //   console.log('whereIs -> whereIs', whereIs)
  // }, [whereIsGame, points, whereIs])

  useEffect(() => {
    if (!whereIs) return
    const pointsToShow = points.map(point => ({ ...point, stroke: undefined, isFound: false }));
    setWhereIsGame(prev => ({
      ...prev,
      lifes: whereIs.lifes,
      dynamic_id: whereIs._id,
      event_user_id: '',
      user_name: '',
      picture: '',
      points: pointsToShow,
    }));
    verifyPlayer();
  }, [whereIs, points])

  // useEffect(() => {
  //   console.log('points', points)
  // }, [points])

  const verifyPlayer = async () => {
    const player = await services.getPlayer({ event_id: cEvent.nameEvent, event_user_id: cUser.value._id });
    setPlayer(player);
  };

  // const { location, setLocation, whereIsGame, setWhereIsGame, player, setPlayer } = context;

  const goTo = (location: WhereIsLocationView) => {
    setLocation(prev => ({ ...prev, activeView: location }));
  };

  const wrongPoint = () => {
    console.log(cEvent.nameEvent);
    if (!whereIsGame.lifes) return;
    if (whereIsGame.lifes - 1 === 0) {
      setWhereIsGame(prev => ({
        ...prev,
        won: false,
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

  const winGame = async () => {
    if (whereIs === null) return;
    const player: Player = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isFinish: true,
      duration: whereIsGame.duration + 1,
      dynamic_id: whereIs._id,
      event_user_id: cUser.value._id,
      user_name: cUser.value.user.names,
      picture: cUser.value.user.picture,
    };
    // console.log('player', player)
    setPlayer(player);
    console.log('Ganaste');
    await services.createPlayer({ ...player, event_id: cEvent.nameEvent });
    goTo('results');
  };

  const loseGame = async () => {
    if (whereIs === null) return;
    const player: Player = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isFinish: false,
      duration: whereIsGame.duration + 1,
      dynamic_id: whereIs._id,
      event_user_id: cUser.value._id,
      user_name: cUser.value.user.names,
      picture: cUser.value.user.picture,
    };
    console.log('Perdiste');
    setPlayer(player);
    await services.createPlayer({ ...player, event_id: cEvent.nameEvent });
    goTo('results');
  };

  const getPlayer = async () => {
    const player = await services.getPlayer({ event_id: cEvent.nameEvent, event_user_id: cUser.value._id });
    return player;
  };

  const getScores = async () => {
    const players = await services.getScores({ event_id: cEvent.nameEvent });
    if (players === null) return { scoresFinished: [], scoresNotFinished: [] };

    const playersFinished = players.filter(player => player.isFinish === true);
    const playersNotFinished = players.filter(player => player.isFinish === false);
    const playersOrderedByDuration = playersFinished.sort((playerA, playerB) => playerA.duration - playerB.duration);
    const scoresFinished = playersOrderedByDuration.map((player, i) => {
      return fromPlayerToScore(player, i + 1);
    });
    const scoresNotFinished = playersNotFinished.map(player => {
      return fromPlayerToScore(player, 0);
    });
    return { scoresFinished, scoresNotFinished };
  };

  return (
    <WhereIsInLandingContext.Provider value={{
      location,
      setLocation,
      whereIsGame,
      setWhereIsGame,
      player,
      setPlayer,
      goTo,
      wrongPoint,
      foundPoint,
      setTimer,
      winGame,
      getPlayer,
      getScores,
    }}>
      {props.children}
    </WhereIsInLandingContext.Provider>
  );
}
