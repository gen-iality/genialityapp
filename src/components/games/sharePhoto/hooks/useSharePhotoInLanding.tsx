import { useContext } from 'react';
import { SharePhotoInLandingContext, SharePhotoLocationView } from '../contexts/SharePhotoInLandingContext';

export default function useSharePhotoInLanding() {
	const context = useContext(SharePhotoInLandingContext);

	if (context === undefined) {
		throw new Error('Debe estar dentro del SharePhotoInLandingProvider');
	}

	const { location, setLocation, imageUploaded, setImageUploaded } = context;

	const goTo = (location: SharePhotoLocationView) => {
		setLocation(prev => ({ ...prev, activeView: location }));
	};

	return { location, goTo, imageUploaded, setImageUploaded };
}
