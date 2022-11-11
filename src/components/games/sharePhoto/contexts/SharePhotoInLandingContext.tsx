import { ReactNode, createContext, useState } from 'react';
import { Like } from '../types';

export type SharePhotoLocationView =
	| 'introduction'
	| 'chooseAction'
	| 'importPhoto'
	| 'takePhoto'
	| 'createPost'
	| 'galery';

export interface SharePhotoLocationType {
	activeView: SharePhotoLocationView;
	views: string[];
}

interface SharePhotoInLandingType {
	location: SharePhotoLocationType;
	goTo: (location: SharePhotoLocationView) => void;
	imageUploaded: string | null;
	setImageUploaded: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SharePhotoInLandingContext = createContext<SharePhotoInLandingType>({} as SharePhotoInLandingType);

interface Props {
	children: ReactNode;
}

const initialLocation: SharePhotoLocationType = {
	activeView: 'introduction',
	views: ['introduction', 'chooseAction', 'importPhoto', 'takePhoto', 'createPost', 'galery'],
};

export default function SharePhotoInLandingProvider(props: Props) {
	const [location, setLocation] = useState<SharePhotoLocationType>(initialLocation);
	const [imageUploaded, setImageUploaded] = useState<string | null>(null);

	const goTo = (location: SharePhotoLocationView) => {
		setLocation(prev => ({ ...prev, activeView: location }));
	};

	return (
		<SharePhotoInLandingContext.Provider value={{ location, goTo, imageUploaded, setImageUploaded }}>
			{props.children}
		</SharePhotoInLandingContext.Provider>
	);
}
