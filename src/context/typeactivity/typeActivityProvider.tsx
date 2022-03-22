import { useReducer } from 'react';
import { TypeActivityContext } from './typeActivityContext';
import { initialState, typeActivityReducer } from './typeActivityReducer';

interface TypeActivityProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const TypeActivityProvider = ({ children }: TypeActivityProviderProps) => {
  const [typeActivityState, typeActivityDispatch] = useReducer(typeActivityReducer, initialState);

  const toggleActivitySteps = (id: string) => {
    console.log('🚀 PROVIDER ID SELECTACTIVITYSTATES', id);
    switch (id) {
      case 'type':
        typeActivityDispatch({ type: 'toggleType', payload: { id } });
        break;
      case 'liveBroadcast':
        typeActivityDispatch({ type: 'toggleLiveBroadcast', payload: { id } });
        break;
      case 'meeting':
        typeActivityDispatch({ type: 'toggleMeeting', payload: { id } });
        break;
      case 'video':
        typeActivityDispatch({ type: 'toggleVideo', payload: { id } });
        break;
      case 'url':
        typeActivityDispatch({ type: 'toggleUrl', payload: { id } });
        break;
      case 'cargarvideo':
        typeActivityDispatch({ type: 'toggleCargarvideo', payload: { id } });
        break;
      case 'eviusStreaming':
        typeActivityDispatch({ type: 'toggleEviusStreaming', payload: { id } });
        break;
      case 'vimeo':
        typeActivityDispatch({ type: 'toggleVimeo', payload: { id } });
        break;
      case 'youTube':
        typeActivityDispatch({ type: 'toggleYouTube', payload: { id } });
        break;

      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
        break;
    }
  };
  const selectOption = (id: string, sendData: any) => {
    console.log('🚀 PROVIDER ID OPCION SELECCIONADA ', id);
    switch (id) {
      case 'liveBroadcast':
        typeActivityDispatch({ type: 'selectLiveBroadcast', payload: { id } });
        break;
      case 'meeting':
        typeActivityDispatch({ type: 'selectMeeting', payload: { id } });
        break;
      case 'video':
        typeActivityDispatch({ type: 'selectVideo', payload: { id } });
        break;
      case 'url':
        typeActivityDispatch({ type: 'selectUrl', payload: { id, sendData } });
        break;
      case 'cargarvideo':
        typeActivityDispatch({ type: 'selectCargarVideo', payload: { id } });
        break;
      case 'eviusStreaming':
        typeActivityDispatch({ type: 'selectEviusStreaming', payload: { id } });
        break;
      case 'vimeo':
        typeActivityDispatch({ type: 'selectVimeo', payload: { id } });
        break;
      case 'youTube':
        typeActivityDispatch({ type: 'selectYouTube', payload: { id } });
        break;
      case 'eviusMeet':
        typeActivityDispatch({ type: 'selectEviusMeet', payload: { id } });
        break;
      case 'RTMP':
        typeActivityDispatch({ type: 'selectRTMP', payload: { id } });
        break;

      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
        break;
    }
  };
  const createTypeActivity = (id: string, data: object) => {
    typeActivityDispatch({ type: 'onFinish', payload: { id, data } });
  };
  const closeModal = () => {
    typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
  };

  return (
    <TypeActivityContext.Provider
      value={{ typeActivityState, toggleActivitySteps, selectOption, closeModal, createTypeActivity }}>
      {children}
    </TypeActivityContext.Provider>
  );
};
