import DrawerSharePhoto from '../components/DrawerSharePhoto';
import SharePhotoProvider from '../contexts/SharePhotoContext';
import SharePhotoInLandingProvider from '../contexts/SharePhotoInLandingContext';
import useSharePhotoInLanding from '../hooks/useSharePhotoInLanding';
import ChooseAction from './landing/ChooseAction';
import CreatePost from './landing/CreatePost';
import Galery from './landing/Galery';
import ImportPhoto from './landing/ImportPhoto';
import Introduction from './landing/Introduction';
import TakePhoto from './landing/TakePhoto';

const RenderView = () => {
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
			component: <Galery />,
		},
	};

	return views[location.activeView].component;
};

interface Props {
	eventId?: string;
}

export default function SharePhotoInLanding(props: Props) {
	return (
		<SharePhotoProvider>
			<SharePhotoInLandingProvider>
				<DrawerSharePhoto>
					<RenderView />
				</DrawerSharePhoto>
			</SharePhotoInLandingProvider>
		</SharePhotoProvider>
	);
}
