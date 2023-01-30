import AssemblyInCMSProvider from './contexts/AssemblyInCMSContext';
import AssemblyInCMS from './views/AssemblyInCMS';

export default function Assembly() {
	return (
		<AssemblyInCMSProvider>
			<AssemblyInCMS />
		</AssemblyInCMSProvider>
	);
}
