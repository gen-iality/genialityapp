import SharePhotoProvider from '../contexts/SharePhotoContext';
import useSharePhoto from '../hooks/useSharePhoto';
import CreateSharePhoto from './cms/CreateSharePhoto';
import UpdateSharePhoto from './cms/UpdateSharePhoto';

interface RenderViewProps {
	eventId: string;
}

const RenderView = (props: RenderViewProps) => {
	const { eventId } = props;
	const { sharePhoto } = useSharePhoto();

	return sharePhoto === null ? <CreateSharePhoto eventId={eventId} /> : <UpdateSharePhoto eventId={eventId} />;
};

interface Props {
	eventId: string;
}

export default function SharePhotoInCMS(props: Props) {
	const { eventId } = props;
	return (
		<SharePhotoProvider>
			<RenderView eventId={eventId} />
		</SharePhotoProvider>
	);
}
