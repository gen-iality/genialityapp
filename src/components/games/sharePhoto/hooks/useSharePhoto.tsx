import { useContext } from 'react';
import { SharePhotoContext } from '../contexts/SharePhotoContext';

export default function useSharePhoto() {
	const context = useContext(SharePhotoContext);

	if (context === undefined) {
		throw new Error('Debe estar dentro del SharePhotoProvider');
	}

	return context;
}
