import { message } from 'antd'
import { useContext, useReducer, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createLiveStream, stopLiveStream } from '../../adaptors/gcoreStreamingApi'
import { AgendaApi, TypesAgendaApi } from '@helpers/request'
import AgendaContext from '../AgendaContext'
import { CurrentEventContext } from '../eventContext'
import { TypeActivityState } from './interfaces/interfaces'
import { TypeActivityContext } from './typeActivityContext'
import { initialState, typeActivityReducer } from './typeActivityReducer'

interface TypeActivityProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const TypeActivityProvider = ({ children }: TypeActivityProviderProps) => {
  const {
    saveConfig,
    deleteTypeActivity,
    setMeetingId,
    setPlatform,
    setTypeActivity,
    activityName,
    activityDispatch,
    dataLive,
    meeting_id,
    activityEdit,
    setDataLive,
    setHabilitarIngreso,
  } = useContext(AgendaContext)
  const cEvent = useContext(CurrentEventContext)
  const [typeActivityState, typeActivityDispatch] = useReducer(
    typeActivityReducer,
    initialState,
  )
  const [loadingStop, setLoadingStop] = useState(false)
  const queryClient = useQueryClient()
  const [videoObject, setVideoObject] = useState<any | null>(null)
  const [loadingCreate, setLoadingCreate] = useState(false)

  const toggleActivitySteps = async (id: string, payload?: TypeActivityState) => {
    switch (id) {
      case 'initial':
        //await deleteTypeActivity();
        typeActivityDispatch({ type: 'initial', payload: { activityState: payload! } })
        break
      case 'type':
        typeActivityDispatch({ type: 'toggleType', payload: { id } })
        break
      case 'liveBroadcast':
        typeActivityDispatch({ type: 'toggleLiveBroadcast', payload: { id } })
        break
      case 'meeting':
        typeActivityDispatch({ type: 'toggleMeeting', payload: { id } })
        break
      case 'video':
        typeActivityDispatch({ type: 'toggleVideo', payload: { id } })
        break
      case 'url':
        typeActivityDispatch({ type: 'toggleUrl', payload: { id } })
        break
      case 'cargarvideo':
        typeActivityDispatch({
          type: 'toggleCargarvideo',
          payload: { id, sendData: null },
        })
        break
      case 'eviusStreaming':
        typeActivityDispatch({ type: 'toggleEviusStreaming', payload: { id } })
        break
      case 'vimeo':
        typeActivityDispatch({ type: 'toggleVimeo', payload: { id } })
        break
      case 'youTube':
        typeActivityDispatch({ type: 'toggleYouTube', payload: { id } })
        break
      case 'finish':
        typeActivityDispatch({ type: 'toggleFinish', payload: { id } })
        break
      case 'visualize':
        typeActivityDispatch({
          type: 'visualize',
          payload: { id: payload?.data as string },
        })
        break
      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false })
        break
    }
  }
  const selectOption = (id: string, sendData: any) => {
    switch (id) {
      case 'liveBroadcast':
        typeActivityDispatch({ type: 'selectLiveBroadcast', payload: { id } })
        break
      case 'meeting':
        typeActivityDispatch({ type: 'selectMeeting', payload: { id } })
        break
      case 'video':
        typeActivityDispatch({ type: 'selectVideo', payload: { id } })
        break
      case 'url':
        typeActivityDispatch({ type: 'selectUrl', payload: { id, sendData } })
        break
      case 'cargarvideo':
        typeActivityDispatch({ type: 'selectCargarVideo', payload: { id, sendData } })
        break
      case 'eviusStreaming':
        typeActivityDispatch({ type: 'selectEviusStreaming', payload: { id } })
        break
      case 'vimeo':
        typeActivityDispatch({ type: 'selectVimeo', payload: { id, sendData } })
        break
      case 'eviusMeet':
        typeActivityDispatch({ type: 'selectEviusMeet', payload: { id } })
        break
      case 'RTMP':
        typeActivityDispatch({ type: 'selectRTMP', payload: { id } })
        break
      case 'youTube':
        typeActivityDispatch({ type: 'selectYouTube', payload: { id, sendData } })
        break
      default:
        typeActivityDispatch({ type: 'toggleCloseModal', payload: false })
        break
    }
  }
  // React query
  const executer_createStream = useMutation(() => createLiveStream(activityName), {
    onSuccess: async (data) => {
      queryClient.setQueryData('livestream', data)

      await saveConfig({
        platformNew: 'wowza',
        type: typeActivityState.selectedKey,
        data: data.id,
      })
      setDataLive(data)
      activityDispatch({ type: 'meeting_created', meeting_id: data.id })
      // Invalidate and refetch
      //queryClient.invalidateQueries('todos')
    },
  })

  const executer_stopStream = async () => {
    //await removeAllRequest(refActivity);
    setLoadingStop(true)
    const liveStreamresponse = await stopLiveStream(meeting_id)
    setDataLive(liveStreamresponse)
    setLoadingStop(false)
    setHabilitarIngreso('ended_meeting_room')
    await saveConfig({ habilitar_ingreso: 'ended_meeting_room' })
    //queryClient.setQueryData('livestream', null);
  }

  const saveTypeActivity = async () => {
    const createTypeActivityBody = {
      name: typeActivityState.selectedKey,
    }

    const activityType = await TypesAgendaApi.create(
      cEvent?.value?._id,
      createTypeActivityBody,
    )
    await AgendaApi.editOne(
      { type_id: activityType._id },
      activityEdit,
      cEvent?.value?._id,
    )
  }

  const createTypeActivity = async () => {
    let resp
    setLoadingCreate(true)
    saveTypeActivity()
    switch (typeActivityState.selectedKey) {
      case 'url':
        try {
          const respUrl = await AgendaApi.editOne(
            { video: typeActivityState.data },
            activityEdit,
            cEvent?.value?._id,
          )
          if (respUrl) {
            resp = await saveConfig({
              platformNew: '',
              type: 'url',
              habilitar_ingreso: '',
              data: typeActivityState.data,
            })
            setTypeActivity('url')
            setPlatform('wowza')
            setMeetingId(typeActivityState.data)
          } else {
            message.error('Error al guardar video')
          }
        } catch (error) {
          message.error('Error al guardar video')
        }

        setLoadingCreate(false)
        //setMeetingId(typeActivityState?.data);
        ////Type:url
        break
      case 'vimeo':
        // Permite agregar id o url completa de vimeo
        try {
          const newDataVimeo = typeActivityState.data
          resp = await saveConfig({
            platformNew: 'vimeo',
            type: 'vimeo',
            data: newDataVimeo,
          })
          setTypeActivity('vimeo')
          setPlatform('vimeo')
          setMeetingId(typeActivityState?.data)
        } catch (error) {
          message.error('Error al asignar id vimeo')
        }
        setLoadingCreate(false)
        break
      case 'youTube':
        // Permite agregar id o url completa de youtube
        try {
          const newData = typeActivityState.data.includes('https://youtu.be/')
            ? typeActivityState.data
            : 'https://youtu.be/' + typeActivityState.data
          resp = await saveConfig({
            platformNew: 'wowza',
            type: 'youTube',
            data: newData,
          })
          setTypeActivity('youTube')
          setPlatform('wowza')
          setMeetingId(typeActivityState?.data)
        } catch (error) {
          message.error('Error al asignar video de youtube')
        }
        setLoadingCreate(false)
        //Type:youTube
        break
      case 'eviusMeet':
        try {
          !meeting_id && executer_createStream.mutate()
          meeting_id &&
            (await saveConfig({
              platformNew: 'wowza',
              type: typeActivityState.selectedKey,
              data: meeting_id,
            }))
          setTypeActivity('eviusMeet')
          setPlatform('wowza')
          toggleActivitySteps('finish')
        } catch (error) {
          message.error('Error al crear transmisión')
        }
        setLoadingCreate(false)

        //type:eviusMeet
        break
      case 'RTMP':
        try {
          !meeting_id && executer_createStream.mutate()
          meeting_id &&
            (await saveConfig({
              platformNew: 'wowza',
              type: typeActivityState.selectedKey,
              data: meeting_id,
            }))
          setTypeActivity('RTMP')
          setPlatform('wowza')
          toggleActivitySteps('finish')
        } catch (error) {
          message.error('Error al crear Rtmp')
        }
        setLoadingCreate(false)
        //type:RTMP
        break
      case 'meeting':
        try {
          resp = await saveConfig({
            platformNew: '',
            type: 'meeting',
            data: typeActivityState?.data,
            habilitar_ingreso: 'only',
          })
          setTypeActivity('meeting')
          setPlatform('wowza')
        } catch (error) {
          message.error('Error al crear reunión')
        }
        setLoadingCreate(false)
        //Type:reunión
        break
      case 'cargarvideo':
        try {
          const data = typeActivityState?.data.split('*')
          const urlVideo = data[0]
          const videoId = data[1]
          const respUrlVideo = await AgendaApi.editOne(
            { video: urlVideo },
            activityEdit,
            cEvent?.value?._id,
          )
          if (respUrlVideo) {
            resp = await saveConfig({
              platformNew: '',
              type: 'video',
              data: urlVideo,
              habilitar_ingreso: '',
            })
            setTypeActivity('video')
            setPlatform('wowza')
            setMeetingId(urlVideo)
          }
        } catch (error) {
          message.error('Error al cargar el video')
        }
        setLoadingCreate(false)
        break

      default:
        break
    }
    if (resp?.state === 'created' || resp?.state === 'updated') {
      toggleActivitySteps('finish')
      setLoadingCreate(false)
    }
  }

  const closeModal = () => {
    typeActivityDispatch({ type: 'toggleCloseModal', payload: false })
  }

  const visualizeVideo = (
    url: string | null,
    created_at: string | null,
    name: string | null,
  ) => {
    url !== null ? setVideoObject({ url, created_at, name }) : setVideoObject(null)
  }

  return (
    <TypeActivityContext.Provider
      value={{
        typeActivityState,
        toggleActivitySteps,
        selectOption,
        closeModal,
        createTypeActivity,
        executer_stopStream,
        loadingStop,
        videoObject,
        visualizeVideo,
        loadingCreate,
      }}>
      {children}
    </TypeActivityContext.Provider>
  )
}
