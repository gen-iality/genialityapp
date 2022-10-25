import SharePhotoInCMS from './views/SharePhotoInCMS';

interface Props {
	eventId: string;
}

export default function SharePhoto(props: Props) {
	const { eventId } = props;
	return <SharePhotoInCMS eventId={eventId} />;
}
