import { useContext } from 'react';
import { SharePhotoInLandingContext } from '../contexts/SharePhotoInLandingContext';

export default function useSharePhotoInLanding() {
	const context = useContext(SharePhotoInLandingContext);

	if (context === undefined) {
		throw new Error('Debe estar dentro del SharePhotoInLandingProvider');
	}

	return context;
}
