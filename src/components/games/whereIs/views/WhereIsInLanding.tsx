import { UseUserEvent } from '@/context/eventUserContext';
import DrawerWhereIs from '../components/DrawerWhereIs';
import WhereIsProvider from '../contexts/WhereIsContext';
import WhereIsInLandingProvider from '../contexts/WhereIsInLandingContext';
import useWhereIsInLanding from '../hooks/useWhereIsInLanding';
import Game from './landing/Game';
import Introduction from './landing/Introduction';
import Results from './landing/Results';
import { useEffect, useState } from 'react';
import { Player } from '../types';

interface RenderViewProps {
	eventId: string;
}

const RenderView = (props: RenderViewProps) => {
	const { eventId } = props;
	const { location, player ,ListenerMyScore,setLocation, ListenerPlayer} = useWhereIsInLanding();
	const [playerRealTime, setPlayerRealTime] = useState<Player>()
	const cUser = UseUserEvent();




	const views = {
		introduction: {
			component: <Introduction />,
		},
		game: {
			component: <Game />,
		},
		results: {
			component: <Results />,
		},
	};
	

	useEffect(() => {
		const unsubscribe= ListenerPlayer(cUser.value._id, setPlayerRealTime)
	  return () => {
		unsubscribe()
	  }
	}, [])


	if (!!playerRealTime) return views.results.component;

	return views[location.activeView].component;
	
};

interface Props {
	eventId: string;
}

export default function WhereIsInLanding(props: Props) {
	const { eventId } = props;
	return (
		<WhereIsProvider>
			<WhereIsInLandingProvider>
				<DrawerWhereIs>
					<RenderView eventId={eventId} />
				</DrawerWhereIs>
			</WhereIsInLandingProvider>
		</WhereIsProvider>
	);
}
