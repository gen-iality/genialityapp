import { useContext } from 'react';
import { BingoPresentationContext } from '../contexts/BingoPresentationContext';

export default function useBingoPresentation() {
	const context = useContext(BingoPresentationContext);

	if (!context) throw new Error('useBingoPresentation must be inside a BingoPresentationContextProvider');

	return context;
}
