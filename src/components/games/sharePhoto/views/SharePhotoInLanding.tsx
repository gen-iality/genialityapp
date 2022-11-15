import DrawerSharePhoto from '../components/landing/DrawerSharePhoto';
import SharePhotoProvider from '../contexts/SharePhotoContext';
import SharePhotoInLandingProvider from '../contexts/SharePhotoInLandingContext';
import useSharePhotoInLanding from '../hooks/useSharePhotoInLanding';
import ChooseAction from './landing/ChooseAction';
import CreatePost from './landing/CreatePost';
import Gallery from './landing/Gallery';
import ImportPhoto from './landing/ImportPhoto';
import Introduction from './landing/Introduction';
import TakePhoto from './landing/TakePhoto';

interface RenderViewProps {
	eventId: string;
}

const RenderView = (props: RenderViewProps) => {
	const { eventId } = props;
	const { location } = useSharePhotoInLanding();

	const views = {
		introduction: {
			component: <Introduction />,
		},
		chooseAction: {
			component: <ChooseAction />,
		},
		importPhoto: {
			component: <ImportPhoto />,
		},
		takePhoto: {
			component: <TakePhoto />,
		},
		createPost: {
			component: <CreatePost />,
		},
		galery: {
			component: <Gallery />,
		},
	};

	return views[location.activeView].component;
};

interface Props {
	eventId: string;
}

export default function SharePhotoInLanding(props: Props) {
	const { eventId } = props;
	return (
		<SharePhotoProvider>
			<SharePhotoInLandingProvider>
				<DrawerSharePhoto>
					<RenderView eventId={eventId} />
				</DrawerSharePhoto>
			</SharePhotoInLandingProvider>
		</SharePhotoProvider>
	);
}
