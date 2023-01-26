import React, { useContext } from 'react';
import { AssemblyInCMSContext } from '../contexts/AssemblyInCMSContext';

export default function useAssemblyInCMS() {
	const context = useContext(AssemblyInCMSContext);
	if (context === undefined) throw new Error('This hook must be inside a AssemblyInCMSProvider');
	return context;
}
