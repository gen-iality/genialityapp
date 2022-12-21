import WhereIsInCMS from './views/WhereIsInCMS';

interface Props {
	eventId: string;
}

export default function WhereIs(props: Props) {
	const { eventId } = props;
	return <WhereIsInCMS eventId={eventId} />;
}
