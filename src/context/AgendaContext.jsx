import { message } from 'antd';
import { createContext, useState, useEffect, useContext, useReducer } from 'react';
import Service from '../components/agenda/roomManager/service';
import { fireRealtime, firestore } from '../helpers/firebase';
import { CurrentEventContext } from './eventContext';
import { CurrentEventUserContext } from './eventUserContext';
import { DispatchMessageService } from './MessageService';
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
  const [avalibleGames, setAvailableGames] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [meeting_id, setMeetingId] = useState(null);
  const [roomStatus, setRoomStatus] = useState('');
  const [select_host_manual, setSelect_host_manual] = useState(false);
  const cEvent = useContext(CurrentEventContext);
  const [transmition, setTransmition] = useState('EviusMeet'); //EviusMeet Para cuando se tenga terminada
  const [useAlreadyCreated, setUseAlreadyCreated] = useState(true);
  const [request, setRequest] = useState({});
  const [requestList, setRequestList] = useState([]);
  const [refActivity, setRefActivity] = useState(null);
  const [typeActivity, setTypeActivity] = useState(undefined);
  const [activityName, setActivityName] = useState(null);
  const [dataLive, setDataLive] = useState(null);

  function reducer(state, action) {
    /* console.log('actiondata', action); */
    switch (action.type) {
      case 'meeting_created':
        /* console.log('meeting_created', action); */
        return { ...state, meeting_id: action.meeting_id };
      case 'meeting_delete':
        return { ...state, meeting_id: null };
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
      console.log('8. ACTIVIDAD ACA===>', activityEdit);
      obtenerDetalleActivity();
      setMeetingId(null);
    }
    async function obtenerDetalleActivity() {
      console.log('8. OBTENER DETALLE ACTIVITY==>', cEvent.value._id, activityEdit);
      //const info = await AgendaApi.getOne(activityEdit, cEvent.value._id);
      const service = new Service(firestore);
      const hasVideoconference = await service.validateHasVideoconference(cEvent.value._id, activityEdit);
      console.log('8. EDIT HAS VIDEO CONFERENCE===>', hasVideoconference);
      if (hasVideoconference) {
        const configuration = await service.getConfiguration(cEvent.value._id, activityEdit);
        console.log('8. CONFIGURATION==>', configuration);
        setIsPublished(typeof configuration.isPublished !== 'undefined' ? configuration.isPublished : true);
        setPlatform(configuration.platform ? configuration.platform : 'wowza');
        setMeetingId(configuration.meeting_id ? configuration.meeting_id : null);
        setRoomStatus(configuration?.habilitar_ingreso == null ? '' : configuration.habilitar_ingreso);
        setTransmition(configuration.transmition || null);
        setAvailableGames(configuration.avalibleGames || []);
        setChat(configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false);
        setSurveys(configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false);
        setGames(configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false);
        setAttendees(configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false);
        setHostId(typeof configuration.host_id !== 'undefined' ? configuration.host_id : null);
        setHostName(typeof configuration.host_name !== 'undefined' ? configuration.host_name : null);
        setHabilitarIngreso(configuration.habilitar_ingreso ? configuration.habilitar_ingreso : '');
        setSelect_host_manual(configuration.select_host_manual ? configuration.select_host_manual : false);
        setTypeActivity(configuration.typeActivity || null);
      } else {
        initializeState();
      }
    }
  }, [activityEdit]);

  //FUNCION QUE PERMITE REINICIALIZAR LOS ESTADOS YA QUE AL AGREGAR O EDITAR OTRA ACTIVIDAD ESTOS TOMAN VALORES ANTERIORES
  const initializeState = () => {
    setIsPublished(true);
    setPlatform('wowza');
    setMeetingId(null);
    setRoomStatus(null);
    setTransmition('EviusMeet');
    setAvailableGames([]);
    setChat(false);
    setSurveys(false);
    setGames(false);
    setAttendees(false);
    setHostId(null);
    setHostName(null);
    setHabilitarIngreso('');
    setSelect_host_manual(false);
    setTypeActivity(null);
  };

  const getRequestByActivity = (refActivity) => {
    fireRealtime
      .ref(refActivity)
      .orderByChild('date')
      .on('value', (snapshot) => {
        let listRequest = {};
        let listRequestArray = [];
        if (snapshot.exists()) {
          let data = snapshot.val();
          if (Object.keys(data).length > 0) {
            Object.keys(data).map((requestData) => {
              listRequest[requestData] = {
                key: requestData,
                id: data[requestData].id,
                title: data[requestData].name,
                date: data[requestData].date,
                active: data[requestData].active || false,
              };
              listRequestArray.push({
                key: requestData,
                id: data[requestData].id,
                title: data[requestData].name,
                date: data[requestData].date,
                active: data[requestData].active || false,
              });
            });
            // console.log('100. LISTADO ACA==>', listRequestArray);
            setRequest(listRequest);
            setRequestList(listRequestArray);
          }
        } else {
          setRequest({});
          setRequestList([]);
        }
      });
  };
  const addRequest = (refActivity, request) => {
    if (request) {
      fireRealtime.ref(refActivity).set(request);
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

  const removeAllRequest = async (refActivity) => {
    if (refActivity) {
      await fireRealtime.ref(refActivity).remove();
    }
  };

  const approvedOrRejectedRequest = async (refActivity, key, status) => {
    console.log('1. APROVE ACA=>', refActivity);
    if (refActivity) {
      await fireRealtime
        .ref(`${refActivity}`)
        .child(key)
        .update({ active: status });
    }
  };

  const prepareData = (datos) => {
    console.log('8. DATOS PREPARE===>', datos);
    const roomInfo = {
      platform: datos?.platformNew || platform,
      //VARIABLE QUE GUARDA LA DATA QUE SE GENERA AL CREAR UN TIPO DE ACTIVIDAD VALIDACIÓN QUE PERMITE CONSERVAR ESTADO O LIMPIARLO
      meeting_id: datos?.data ? datos?.data : datos?.type !== 'delete' ? meeting_id : null,
      isPublished: isPublished ? isPublished : false,
      host_id,
      host_name,
      avalibleGames,
      habilitar_ingreso: datos?.type === 'delete' ? '' : roomStatus,
      transmition: transmition || null,
      //PERMITE REINICIALIZAR EL TIPO DE ACTIVIDAD O EN SU CASO BORRARLO  Y CONSERVAR EL ESTADO ACTUAL (type=delete)
      typeActivity:
        datos?.type && datos?.type !== 'delete' ? datos?.type : datos?.type == 'delete' ? null : typeActivity,
    };
    const tabs = { chat, surveys, games, attendees };
    return { roomInfo, tabs };
  };

  const saveConfig = async (data = null, notify = 1) => {
    console.log('8. LLEGA ACA SAVE CONFIG===>');
    const respuesta = prepareData(data);
    console.log('8. RESPUEST PREPARE===>', respuesta);
    if (respuesta) {
      console.log('8. ENTRA AL IF==>');
      const { roomInfo, tabs } = respuesta;
      console.log('8. DATA ACA===>', roomInfo, activityEdit);

      const activity_id = activityEdit;
      const service = new Service(firestore);
      try {
        const result = await service.createOrUpdateActivity(cEvent.value._id, activity_id, roomInfo, tabs);
        if (result && notify) {
          DispatchMessageService({
            type: 'success',
            msj: result.message,
            action: 'show',
          });
        }
        return result;
      } catch (err) {
        DispatchMessageService({
          type: 'error',
          msj: 'Error en la configuración!',
          action: 'show',
        });
      }
    }
  };

  const deleteTypeActivity = async () => {
    const { roomInfo, tabs } = prepareData({ type: 'delete' });

    const activity_id = activityEdit;
    const service = new Service(firestore);
    try {
      const result = await service.createOrUpdateActivity(cEvent.value._id, activity_id, roomInfo, tabs);
      if (result) {
        //CLEAN STATUS
        setTypeActivity(null);
        setMeetingId(null);
        setRoomStatus('');
        DispatchMessageService({
          type: 'success',
          msj: result.message,
          action: 'show',
        });
      }
      return result;
    } catch (err) {
      DispatchMessageService({
        type: 'error',
        msj: 'Error en la configuración!',
        action: 'show',
      });
    }
  };

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(data);
    message.success('Copiado correctamente.!');
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
        setRefActivity,
        refActivity,
        requestList,
        removeAllRequest,
        typeActivity,
        saveConfig,
        deleteTypeActivity,
        setTypeActivity,
        setActivityName,
        activityName,
        dataLive,
        setDataLive,
        copyToClipboard,
      }}>
      {children}
    </AgendaContext.Provider>
  );
};

export default AgendaContext;
