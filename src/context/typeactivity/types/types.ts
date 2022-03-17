import { TypeActivity, typeActivityState } from '../interfaces/interfaces';

export type TypeActivityAction =
  | { type: 'type'; payload: TypeActivity }
  | { type: 'toggleType'; payload: { id: string } }
  | { type: 'toggleProvider'; payload: { id: string } }
  | { type: 'toggleOrigin'; payload: { id: string } }
  | { type: 'toggleCloseModal'; payload: boolean };

export type TypeActivityContextProps = {
  typeActivityState: typeActivityState;
  selectActivitySteps: (id: string) => void;
  closeModal: () => void;
};
