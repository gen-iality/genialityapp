import { ReactNode, createContext } from 'react';
import { SharePhoto } from '../types';

interface SharePhotoContextType {
	sharePhoto: SharePhoto | null;
}

export const SharePhotoContext = createContext<SharePhotoContextType>(
	{} as SharePhotoContextType
);

const initialState = {
	sharePhoto: null,
};

interface Props {
	children: ReactNode;
}

export default function SharePhotoProvider(props: Props) {
	return (
		<SharePhotoContext.Provider value={initialState}>
			{props.children}
		</SharePhotoContext.Provider>
	);
}
