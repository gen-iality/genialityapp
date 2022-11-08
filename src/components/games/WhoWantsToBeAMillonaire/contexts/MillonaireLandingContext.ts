import { createContext } from 'react';
import { TMillonaireContextPropLanding } from '../interfaces/Millonaire';
const MillonaireLandingContext = createContext<TMillonaireContextPropLanding>({} as TMillonaireContextPropLanding);

export default MillonaireLandingContext;
