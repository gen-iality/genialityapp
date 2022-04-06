import { TypeActivity, TypeActivityState } from '../interfaces/interfaces';

export type TypeActivityAction =
  | { type: 'initial'; payload: { activityState: TypeActivityState } }
  | { type: 'type'; payload: TypeActivity }
  | { type: 'toggleType'; payload: { id: string } }
  | { type: 'toggleLiveBroadcast'; payload: { id: string } }
  | { type: 'toggleMeeting'; payload: { id: string } }
  | { type: 'toggleVideo'; payload: { id: string } }
  | { type: 'toggleCargarvideo'; payload: { id: string } }
  | { type: 'toggleUrl'; payload: { id: string } }
  | { type: 'toggleEviusStreaming'; payload: { id: string } }
  | { type: 'toggleVimeo'; payload: { id: string } }
  | { type: 'toggleYouTube'; payload: { id: string } }
  | { type: 'onFinish'; payload: { id: string; data: object } }
  | { type: 'toggleFinish'; payload: { id: string } }
  | { type: 'toggleCloseModal'; payload: boolean }
  | { type: 'selectLiveBroadcast'; payload: { id: string } }
  | { type: 'selectMeeting'; payload: { id: string } }
  | { type: 'selectVideo'; payload: { id: string } }
  | { type: 'selectCargarVideo'; payload: { id: string } }
  | { type: 'selectUrl'; payload: { id: string; sendData: any } }
  | { type: 'selectEviusStreaming'; payload: { id: string } }
  | { type: 'selectVimeo'; payload: { id: string; sendData: any } }
  | { type: 'selectYouTube'; payload: { id: string; sendData: any } }
  | { type: 'selectEviusMeet'; payload: { id: string } }
  | { type: 'selectRTMP'; payload: { id: string } }
  | { type: 'visualize'; payload: { id: string } };

export type TypeActivityContextProps = {
  typeActivityState: TypeActivityState;
  toggleActivitySteps: (id: string, payload?: TypeActivityState) => void;
  closeModal: () => void;
  selectOption: (id: string, sendData?: any) => void;
  createTypeActivity: () => void;
  executer_stopStream: () => void;
  loadingStop: boolean;
  videoObject: { created_at: string; name: string; url: string } | null;
  visualizeVideo: (url: string | null, created_at: string | null, name: string | null) => void;
};
