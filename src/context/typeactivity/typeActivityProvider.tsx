import { useContext, useReducer } from 'react';
import AgendaContext from '../AgendaContext';
import { TypeActivityState } from './interfaces/interfaces';
import { TypeActivityContext } from './typeActivityContext';
import { initialState, typeActivityReducer } from './typeActivityReducer';

interface TypeActivityProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const TypeActivityProvider = ({ children }: TypeActivityProviderProps) => {
  const { saveConfig, deleteTypeActivity, setMeetingId, setPlatform, setTypeActivity } = useContext(AgendaContext);
  const [typeActivityState, typeActivityDispatch] = useReducer(typeActivityReducer, initialState);

  const toggleActivitySteps = async (id: string, payload?: TypeActivityState) => {
    console.log('🚀 PROVIDER ID SELECTACTIVITYSTATES', id);
    switch (id) {
      case 'initial':
        await deleteTypeActivity();
        typeActivityDispatch({ type: 'initial', payload: { activityState: payload } });
        break;
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
      case 'finish':
        typeActivityDispatch({ type: 'toggleFinish', payload: { id } });
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
        typeActivityDispatch({ type: 'selectVimeo', payload: { id, sendData } });
        break;
      case 'eviusMeet':
        typeActivityDispatch({ type: 'selectEviusMeet', payload: { id } });
        break;
      case 'RTMP':
        typeActivityDispatch({ type: 'selectRTMP', payload: { id } });
        break;
      case 'youTube':
        typeActivityDispatch({ type: 'selectYouTube', payload: { id, sendData } });
        break;
      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false });
        break;
    }
  };
  /*const createTypeActivity = (id: string, data: object) => {
    typeActivityDispatch({ type: 'onFinish', payload: { id, data } });
  };*/

  const createTypeActivity = async () => {
    console.log('DATA ACTUAL==>', typeActivityState);
    /* url: 'Video',
  meeting: 'reunión',
  vimeo: 'vimeo',
  youTube: 'Youtube',
  eviusMeet: 'EviusMeet',
  RTMP: 'Transmisión',*/
    let resp;
    switch (typeActivityState.selectedKey) {
      case 'url':
        resp = await saveConfig({ platformNew: '', type: 'url', data: typeActivityState.data });
        setTypeActivity('url');
        setPlatform('wowza');
        //setMeetingId(typeActivityState?.data);
        ////Type:url
        break;
      case 'vimeo':
        //Type:Vimeo
        //Platform
        //meeting_id
        resp = await saveConfig({ platformNew: 'vimeo', type: 'vimeo', data: typeActivityState.data });
        setTypeActivity('vimeo');
        setPlatform('vimeo');
        setMeetingId(typeActivityState?.data);

        break;
      case 'youTube':
        resp = await saveConfig({ platformNew: 'wowza', type: 'youTube', data: typeActivityState.data });
        setTypeActivity('youTube');
        setPlatform('wowza');
        setMeetingId(typeActivityState?.data);
        //Type:youTube
        break;
      case 'eviusMeet':
        resp = await saveConfig({ platformNew: '', type: 'eviusMeet', data: typeActivityState?.data });
        setTypeActivity('eviusMeet');
        setPlatform('wowza');
        //type:eviusMeet
        break;
      case 'RTMP':
        resp = await saveConfig({ platformNew: '', type: 'RTMP', data: typeActivityState?.data });
        setTypeActivity('RTMP');
        setPlatform('wowza');
        //type:RTMP
        break;
      case 'meeting':
        resp = await saveConfig({ platformNew: '', type: 'meeting', data: typeActivityState?.data });
        setTypeActivity('meeting');
        setPlatform('wowza');
        //Type:reunión
        break;
      case 'cargarvideo':
        resp = await saveConfig({ platformNew: '', type: 'url', data: typeActivityState?.data });
        setTypeActivity('url');
        setPlatform('wowza');
        //Type:url
        break;

      default:
        break;
    }
    if (resp.state === 'created' || resp.state === 'updated') {
      toggleActivitySteps('finish');
    }
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
