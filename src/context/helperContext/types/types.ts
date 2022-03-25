import { HelperState } from '../interfaces/interfaces';

export type HelperAction =
  | { type: 'toggleType'; payload: { id: string } }
  | { type: 'selectLiveBroadcast'; payload: { id: string } };

export type HelperContextProps = any;
