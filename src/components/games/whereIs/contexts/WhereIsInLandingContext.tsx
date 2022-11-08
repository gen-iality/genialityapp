import { createContext, ReactNode, useState } from 'react';
import { Player, WhereIsGame } from '../types';

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
}

export const WhereIsInLandingContext = createContext<WhereIsInLandingType>({} as WhereIsInLandingType);

const initialLocation: WhereIsLocation = {
  activeView: 'introduction',
  views: ['introduction', 'game', 'results'],
};

const initialWhereIsGame: WhereIsGame = {
  // id: '',
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
  return (
    <WhereIsInLandingContext.Provider value={{ location, setLocation, whereIsGame, setWhereIsGame, player, setPlayer }}>
      {props.children}
    </WhereIsInLandingContext.Provider>
  );
}
