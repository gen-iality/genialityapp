import { ReactNode, createContext, useState } from 'react';
import { SharePhoto } from '../types';

interface SharePhotoContextType {
	sharePhoto: SharePhoto | null;
	setSharePhoto: React.Dispatch<React.SetStateAction<SharePhoto | null>>;
}

export const SharePhotoContext = createContext<SharePhotoContextType>(
	{} as SharePhotoContextType
);

interface Props {
	children: ReactNode;
}


export default function SharePhotoProvider(props: Props) {
	const [sharePhoto, setSharePhoto] = useState<SharePhoto | null>(null);

	return (
		<SharePhotoContext.Provider value={{ sharePhoto, setSharePhoto }}>
			{props.children}
		</SharePhotoContext.Provider>
	);
}
