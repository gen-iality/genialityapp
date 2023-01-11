import BingoPresentationContextProvider from '../contexts/BingoPresentationContext';
import Presentation from './presentation/Presentation';

interface Props {
	history: any;
	location: any;
	match: {
		isExact: boolean;
		params: {
			event_id: string;
		};
		path: string;
		url: string;
	};
	staticContext: any;
}

export default function BingoPresentation(props: Props) {
	return (
		<BingoPresentationContextProvider eventId={props.match.params.event_id}>
			<Presentation />
		</BingoPresentationContextProvider>
	);
}
