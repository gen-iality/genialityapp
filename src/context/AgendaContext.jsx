import { createContext, useState, useEffect, useContext, useReducer } from 'react'
import Service from '@components/agenda/roomManager/service'
import { fireRealtime, firestore } from '@helpers/firebase'
import { CurrentEventContext } from './eventContext'
import { StateMessage } from './MessageService'
export const AgendaContext = createContext()

const initialState = {
  meeting_id: null,
}

export const AgendaContextProvider = ({ children }) => {
  const [activityState, activityDispatch] = useReducer(reducer, initialState)
  const [chat, setChat] = useState(false)
  const [activityEdit, setActivityEdit] = useState()
  const [surveys, setSurveys] = useState(false)
  const [games, setGames] = useState(false)
  const [attendees, setAttendees] = useState(false)
  const [host_id, setHostId] = useState(null)
  const [host_name, setHostName] = useState(null)
  const [habilitar_ingreso, setHabilitarIngreso] = useState('')
  const [platform, setPlatform] = useState('wowza')
  const [vimeo_id, setVimeoId] = useState('')
  const [name_host, setNameHost] = useState('')
  const [avalibleGames, setAvailableGames] = useState([])
  const [isPublished, setIsPublished] = useState(true)
  const [meeting_id, setMeetingId] = useState(null)
  const [roomStatus, setRoomStatus] = useState('')
  const [select_host_manual, setSelect_host_manual] = useState(false)
  const cEvent = useContext(CurrentEventContext)
  const [transmition, setTransmition] = useState('EviusMeet') //EviusMeet para cuando se tenga terminada
  const [useAlreadyCreated, setUseAlreadyCreated] = useState(true)
  const [refActivity, setRefActivity] = useState(null)
  const [typeActivity, setTypeActivity] = useState(undefined)
  const [activityName, setActivityName] = useState(null)
  const [dataLive, setDataLive] = useState(null)
  const [recordings, setRecordings] = useState([])
  const [loadingRecord, setLoadingRecord] = useState(false)
  const [record, setRecord] = useState('start')

  function reducer(state, action) {
    switch (action.type) {
      case 'meeting_created':
        return { ...state, meeting_id: action.meeting_id }
      case 'meeting_delete':
        return { ...state, meeting_id: null }
      case 'stop':
        return { ...state, isRunning: false }
      case 'reset':
        return { isRunning: false, time: 0 }
      case 'tick':
        return { ...state, time: state.time + 1 }
      default:
        throw new Error()
    }
  }

  //Un patch temporal mientras la transisicón a reducer/store
  useEffect(() => {
    setMeetingId(activityState.meeting_id) //esta linea es temporal mejor reeplazarla por el store del reducer
  }, [activityState.meeting_id])

  useEffect(() => {
    if (dataLive) {
      setRecord(dataLive.recording ? 'stop' : 'start')
    }
  }, [dataLive])

  async function obtenerDetalleActivity() {
    console.log('8. OBTENER DETALLE ACTIVITY==>', cEvent.value._id, activityEdit)

    const service = new Service(firestore)
    const hasVideoconference = await service.validateHasVideoconference(
      cEvent.value._id,
      activityEdit,
    )
    console.log('8. EDIT HAS VIDEO CONFERENCE===>', hasVideoconference)
    if (hasVideoconference) {
      const configuration = await service.getConfiguration(cEvent.value._id, activityEdit)

      console.log('8. CONFIGURATION==>', configuration)
      setIsPublished(!!configuration.isPublished)
      setPlatform(configuration.platform ? configuration.platform : 'wowza')
      setMeetingId(configuration.meeting_id ? configuration.meeting_id : null)
      setRoomStatus(
        configuration?.habilitar_ingreso == null
          ? ''
          : configuration.habilitar_ingreso
          ? configuration.habilitar_ingreso
          : '',
      )
      setTransmition(configuration.transmition || null)
      setAvailableGames(configuration.avalibleGames || [])
      setChat(
        configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false,
      )
      setSurveys(
        configuration.tabs && configuration.tabs.surveys
          ? configuration.tabs.surveys
          : false,
      )
      setGames(
        configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false,
      )
      setAttendees(
        configuration.tabs && configuration.tabs.attendees
          ? configuration.tabs.attendees
          : false,
      )
      setHostId(
        typeof configuration.host_id !== 'undefined' ? configuration.host_id : null,
      )
      setHostName(
        typeof configuration.host_name !== 'undefined' ? configuration.host_name : null,
      )
      setHabilitarIngreso(
        configuration.habilitar_ingreso ? configuration.habilitar_ingreso : '',
      )
      setSelect_host_manual(
        configuration.select_host_manual ? configuration.select_host_manual : false,
      )
      setTypeActivity(configuration.typeActivity || null)
      setDataLive(null)
    } else {
      initializeState()
    }
  }

  useEffect(() => {
    if (activityEdit) {
      obtenerDetalleActivity()
    } else {
      initializeState()
    }
  }, [activityEdit])

  // Funcion que permite reinicializar los estados ya que al agregar o editar otra lección estos toman valores anteriores
  const initializeState = () => {
    setIsPublished(true)
    setPlatform('wowza')
    setMeetingId(null)
    setRoomStatus('')
    setTransmition('EviusMeet')
    setAvailableGames([])
    setChat(false)
    setSurveys(false)
    setGames(false)
    setAttendees(false)
    setHostId(null)
    setHostName(null)
    setHabilitarIngreso('')
    setSelect_host_manual(false)
    setTypeActivity(null)
    setDataLive(null)
  }

  const prepareData = (datos) => {
    const roomInfo = {
      platform: datos?.platformNew || platform,
      // Variable que guarda la data que se genera al crear un tipo de lección validación que permite conservar estado o limpiarlo
      meeting_id: datos?.data
        ? datos?.data
        : datos?.type !== 'delete'
        ? meeting_id
        : null,
      isPublished:
        typeof isPublished === 'string' ? isPublished === 'true' : !!isPublished,
      host_id,
      host_name,
      avalibleGames,
      habilitar_ingreso:
        datos?.type === 'delete'
          ? ''
          : datos?.habilitar_ingreso
          ? datos?.habilitar_ingreso
          : roomStatus,
      transmition: transmition || null,
      //PERMITE REINICIALIZAR EL TIPO DE LECCIÓN O EN SU CASO BORRARLO  Y CONSERVAR EL ESTADO ACTUAL (type=delete)
      typeActivity:
        datos?.type && datos?.type !== 'delete'
          ? datos?.type
          : datos?.type == 'delete'
          ? null
          : typeActivity,
    }
    const tabs = { chat, surveys, games, attendees }
    return { roomInfo, tabs }
  }

  const saveConfig = async (data = null, notify = 1) => {
    const respuesta = prepareData(data)
    if (respuesta) {
      const { roomInfo, tabs } = respuesta
      const activity_id = activityEdit
      const service = new Service(firestore)
      try {
        const result = await service.createOrUpdateActivity(
          cEvent.value._id,
          activity_id,
          roomInfo,
          tabs,
        )
        // await TypesAgendaApi.create(cEvent.value._id, data);
        if (result && notify) {
          StateMessage.show(null, 'success', result.message)
        }
        return result
      } catch (err) {
        StateMessage.show(null, 'error', 'Error en la configuración!')
      }
    }
  }

  const obtainUrl = (type, data) => {
    const previewBaseUrlVideo = import.meta.env.VITE_PLACEHOLDER_LIVE_TRANSMITION
    // 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807';
    let urlVideo
    switch (type) {
      case 'vimeo':
        urlVideo = data?.includes('https://player.vimeo.com/video/')
          ? data
          : 'https://player.vimeo.com/video/' + data
        break
      case 'Youtube':
        urlVideo = data?.includes('https://youtu.be/') ? data : 'https://youtu.be/' + data
        break
      case 'Transmisión':
        urlVideo = !dataLive?.live ? previewBaseUrlVideo : dataLive.iframe_url
        break
      case 'EviusMeet':
        urlVideo = !dataLive?.live ? previewBaseUrlVideo : dataLive.iframe_url
        break
      case 'Video':
        if (data) {
          const dataSplit = data.split('*')
          console.log('dataSplit', dataSplit)
          urlVideo = dataSplit[0]
        } else {
          urlVideo = null
        }
        break
      default:
        urlVideo = data
    }
    // Se valida con url que contenga youtube debido a que react player no muestra video de gcore
    const visibleReactPlayer =
      ((type == 'Youtube' ||
        (type == 'Video' && data.includes('youtube')) ||
        (type == 'Video' && data.includes('vimeo'))) &&
        urlVideo) ||
      (((dataLive?.live && !dataLive?.active) ||
        (!dataLive?.live && !dataLive?.active)) &&
        (type === 'Transmisión' || type === 'EviusMeet'))
        ? true
        : false
    return { urlVideo, visibleReactPlayer }
  }

  const deleteTypeActivity = async () => {
    const { roomInfo, tabs } = prepareData({ type: 'delete' })

    const activity_id = activityEdit
    const service = new Service(firestore)
    try {
      const result = await service.createOrUpdateActivity(
        cEvent.value._id,
        activity_id,
        roomInfo,
        tabs,
      )
      if (result) {
        // Clean status
        setTypeActivity(null)
        setMeetingId(null)
        setRoomStatus('')
        setDataLive(null)
        StateMessage.show(null, 'success', result.message)
      }
      return result
    } catch (err) {
      StateMessage.show(null, 'error', 'Error en la configuración!')
    }
  }

  const refreshActivity = () => {
    obtenerDetalleActivity()
  }

  return (
    <AgendaContext.Provider
      value={{
        obtenerDetalleActivity,
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
        avalibleGames, // availableGames*
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
        setRefActivity,
        refActivity,
        typeActivity,
        saveConfig,
        deleteTypeActivity,
        setTypeActivity,
        setActivityName,
        activityName,
        dataLive,
        setDataLive,
        recordings,
        obtainUrl,
        refreshActivity,
        loadingRecord,
        record,
      }}
    >
      {children}
    </AgendaContext.Provider>
  )
}

export default AgendaContext
