import { useContext } from 'react';
import { BingoContext } from '../contexts/BingoContext';

export default function useBingoContext() {
	const context = useContext(BingoContext);

	if (!context) throw new Error('This hook must be used inside BingoProvider');

	return context;
}
