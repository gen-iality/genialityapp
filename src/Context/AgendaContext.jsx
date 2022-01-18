import { keyOf } from 'core-js/library/core/dict';
import { createContext, useState, useEffect, useContext, useReducer } from 'react';
import Service from '../components/agenda/roomManager/service';
import { fireRealtime, firestore } from '../helpers/firebase';
import { AgendaApi } from '../helpers/request';
import { CurrentEventContext } from './eventContext';

export const AgendaContext = createContext();

const initialState = {
  meeting_id: null,
};

export const AgendaContextProvider = ({ children }) => {
  const [activityState, activityDispatch] = useReducer(reducer, initialState);
  const [chat, setChat] = useState(false);
  const [activityEdit, setActivityEdit] = useState();
  const [surveys, setSurveys] = useState(false);
  const [games, setGames] = useState(false);
  const [attendees, setAttendees] = useState(false);
  const [host_id, setHostId] = useState(null);
  const [host_name, setHostName] = useState(null);
  const [habilitar_ingreso, setHabilitarIngreso] = useState('');
  const [platform, setPlatform] = useState('wowza');
  const [vimeo_id, setVimeoId] = useState('');
  const [name_host, setNameHost] = useState('');
  const [avalibleGames, setAvailableGames] = useState();
  const [isPublished, setIsPublished] = useState();
  const [meeting_id, setMeetingId] = useState(null);
  const [roomStatus, setRoomStatus] = useState('');
  const [select_host_manual, setSelect_host_manual] = useState(false);
  const cEvent = useContext(CurrentEventContext);
  const [transmition, setTransmition] = useState('EviusMeet'); //EviusMeet Para cuando se tenga terminada
  const [useAlreadyCreated, setUseAlreadyCreated] = useState(true);
  const [request, setRequest] = useState([]);

  function reducer(state, action) {
    /* console.log('actiondata', action); */
    switch (action.type) {
      case 'meeting_created':
        /* console.log('meeting_created', action); */
        return { ...state, meeting_id: action.meeting_id };

      case 'stop':
        return { ...state, isRunning: false };
      case 'reset':
        return { isRunning: false, time: 0 };
      case 'tick':
        return { ...state, time: state.time + 1 };
      default:
        throw new Error();
    }
  }

  //Un patch temporal mientras la transisicón a reducer/store
  useEffect(() => {
    console.log('meeting_created_local', activityState);
    setMeetingId(activityState.meeting_id); //esta linea es temporal mejor reeplazarla por el store del reducer
  }, [activityState.meeting_id]);

  useEffect(() => {
    if (activityEdit) {
      obtenerDetalleActivity();
    }
    async function obtenerDetalleActivity() {
      //const info = await AgendaApi.getOne(activityEdit, cEvent.value._id);
      const service = new Service(firestore);
      const hasVideoconference = await service.validateHasVideoconference(cEvent.value._id, activityEdit);
      if (hasVideoconference) {
        const configuration = await service.getConfiguration(cEvent.value._id, activityEdit);
        /* console.log('GET CONFIGURATION==>', configuration); */
        setIsPublished(typeof configuration.isPublished !== 'undefined' ? configuration.isPublished : true);
        setPlatform(configuration.platform ? configuration.platform : 'wowza');
        setMeetingId(configuration.meeting_id ? configuration.meeting_id : null);
        setRoomStatus(configuration.habilitar_ingreso);
        setAvailableGames(configuration.avalibleGames || []);
        setChat(configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false);
        setSurveys(configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false);
        setGames(configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false);
        setAttendees(configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false);
        setHostId(typeof configuration.host_id !== 'undefined' ? configuration.host_id : null);
        setHostName(typeof configuration.host_name !== 'undefined' ? configuration.host_name : null);
        setHabilitarIngreso(configuration.habilitar_ingreso ? configuration.habilitar_ingreso : '');
        setSelect_host_manual(configuration.select_host_manual ? configuration.select_host_manual : false);
      }
    }
  }, [activityEdit]);

  const getRequestByActivity = (refActivity) => {
    fireRealtime
      .ref(refActivity)
      .orderByChild('date')
      .on('value', (snapshot) => {
        let listRequest = [];
        if (snapshot.exists()) {
          let data = snapshot.val();
          if (Object.keys(data).length > 0) {
            Object.keys(data).map((requestData) => {
              listRequest.push({
                key: requestData,
                id: data[requestData].id,
                title: data[requestData].name,
                date: data[requestData].date,
                active: false,
              });
            });
            setRequest(listRequest);
          }
        } else {
          setRequest([]);
        }
      });
  };

  const addRequest = (refActivity, request) => {
    if (request) {
      fireRealtime.ref(refActivity).push(request);
    }
  };

  const removeRequest = async (refActivity, key) => {
    if (key) {
      await fireRealtime
        .ref(refActivity)
        .child(key)
        .remove();
    }
  };

  const approvedOrRejectedRequest = async (refActivity, key, status) => {
    if (key) {
      await fireRealtime
        .ref(refActivity)
        .child(key)
        .update({ active: status });
    }
  };

  return (
    <AgendaContext.Provider
      value={{
        chat,
        setChat,
        activityEdit,
        setActivityEdit,
        surveys,
        setSurveys,
        games,
        setGames,
        attendees,
        setAttendees,
        host_id,
        setHostId,
        host_name,
        setHostName,
        habilitar_ingreso,
        setHabilitarIngreso,
        platform,
        setPlatform,
        vimeo_id,
        setVimeoId,
        name_host,
        setNameHost,
        avalibleGames,
        setAvailableGames,
        isPublished,
        setIsPublished,
        meeting_id,
        setMeetingId,
        roomStatus,
        setRoomStatus,
        select_host_manual,
        activityState,
        activityDispatch,
        transmition,
        setTransmition,
        useAlreadyCreated,
        setUseAlreadyCreated,
        getRequestByActivity,
        request,
        addRequest,
        removeRequest,
        approvedOrRejectedRequest,
      }}>
      {children}
    </AgendaContext.Provider>
  );
};

export default AgendaContext;
