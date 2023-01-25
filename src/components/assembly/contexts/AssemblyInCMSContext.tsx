import { createContext, ReactNode } from 'react';

const assemblyInitialValue = {};

export const AssemblyInCMSContext = createContext(assemblyInitialValue);

interface Props {
	children: ReactNode;
}

export default function AssemblyInCMSProvider(props: Props) {
	return <AssemblyInCMSContext.Provider value={{}}>{props.children}</AssemblyInCMSContext.Provider>;
}
