import { message } from 'antd';
import { useContext, useEffect, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createLiveStream, stopLiveStream } from '../../adaptors/gcoreStreamingApi';
import { AgendaApi, TypesAgendaApi } from '../../helpers/request';
import AgendaContext from '../AgendaContext';
import { CurrentEventContext } from '../eventContext';

import ActivityTypeContext from './activityTypeContext';
import { ActivitySubTypeName, ActivityTypeName } from './schema/structureInterfaces';
import {
  ActivityTypeProviderProps,
  ActivityTypeContextType,
} from './types/types';
import { activitySubTypeKeys, activityTypeData, simplifiedActivityTypeMap } from './schema/activityTypeFormStructure';
// Temporally
import { ExtendedAgendaDocumentType } from '@/components/agenda/types/AgendaDocumentType';

function ActivityTypeProvider(props: ActivityTypeProviderProps) {
  const {
    saveConfig,
    deleteTypeActivity,
    setMeetingId,
    setPlatform,
    setTypeActivity,
    activityName,
    activityDispatch,
    dataLive,
    meeting_id: meetingId,
    activityEdit,
    setDataLive,
    setHabilitarIngreso,
  } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);
  const [isStoppingStreaming, setIsStoppingStreaming] = useState(false);
  const [isCreatingActivityType, setIsCreatingActivityType] = useState(false);
  const [isSavingActivityType, setIsSavingActivityType] = useState(false);
  const [isDeletingActivityType, setIsDeletingActivityType] = useState(false);
  const [isUpdatingActivityType, setIsUpdatingActivityType] = useState(false);
  const [isUpdatingActivityContent, setIsUpdatingActivityContent] = useState(false);
  const [videoObject, setVideoObject] = useState<any | null>(null);
  const [activityType, setActivityType] = useState<ActivityTypeName | null>(null);
  const [activityContentType, setActivityContentType] = useState<ActivitySubTypeName | null>(null);
  const [contentSource, setContentSource] = useState<string | null>(meetingId || null);

  const queryClient = useQueryClient();

  const translateActivityType = useCallback((type: string) => {
    const value = simplifiedActivityTypeMap[type as keyof typeof simplifiedActivityTypeMap];
    if (!value) {
      console.error(`transpilerActivityType cannot find ${type} in ${simplifiedActivityTypeMap}`);
      return null;
    }
    return value;
  }, []);

  const editActivityType = async (eventId: string, activityId: string, typeName: string) => {
    const createTypeActivityBody: any = { name: typeName };
    const activityTypeDocument = await TypesAgendaApi
      .create(cEvent.value._id, createTypeActivityBody);
    const agenda: ExtendedAgendaDocumentType = await AgendaApi
      .editOne({ type_id: activityTypeDocument._id }, activityId, eventId);
    return agenda;
  }

  const saveActivityType = async () => {
    console.debug('activity type provider is saving...');
    console.debug('activityType is:', activityType);
    if (!activityType) {
      console.error('activityType (from ActivityTypeProvider) is none');
      return;
    }

    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
      return;
    }

    if (!activityEdit) {
      console.error('activityEdit (from AgendaContext) is none');
      return;
    }

    setIsSavingActivityType(true);

    try {
      const agenda = await editActivityType(cEvent.value._id, activityEdit, activityType);
      console.debug('activity type changes:', agenda);
      console.debug('AT provider saves successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingActivityType(false);
    }
  };

  const deleteActivityType = async () => {
    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.deleteActivityType cannot get cEvent.value._id');
      return;
    }

    if (!activityEdit) {
      console.error('activityEdit (from AgendaContext) is none');
      return;
    }

    console.debug('AT provider is deleting');

    setIsDeletingActivityType(true);

    setContentSource(null);
    try {
      await TypesAgendaApi.deleteOne(activityEdit, cEvent.value._id);
      console.debug('AT provider delete successfully');
    } catch (err) {
      console.error('no puede eliminar tipo de actividad:', err);
    } finally {
      setIsDeletingActivityType(false);
      setActivityType(null);
    }
  };

  const resetActivityType = async (type: ActivityTypeName) => {
    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.resetActivityType cannot get cEvent.value._id');
      return;
    }

    if (!activityEdit) {
      console.error('activityEdit (from AgendaContext) is none');
      return;
    }

    console.debug('AT provider is reseting');

    setIsDeletingActivityType(true);
    setActivityContentType(null);
    await editActivityType(cEvent.value._id, activityEdit, type);
  }

  const saveActivityContent = async (type?: ActivitySubTypeName) => {
    if (activityType === null) {
      console.error('activityType (from ActivityTypeProvider) is none');
      return;
    }

    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.saveActivityContent cannot get cEvent.value._id');
      return;
    }

    if (!activityEdit) {
      console.error('activityEdit (from AgendaContext) is none');
      return;
    }

    if (type) setActivityContentType(type);
    const contentType = activityContentType || type;

    if (!contentType) {
      console.error('ActivityTypeProvider.saveActivityContent: content type must not be none');
      return;
    }

    console.debug('contentType:', contentType);

    setIsUpdatingActivityContent(true);

    const agenda = await editActivityType(cEvent.value._id, activityEdit, contentType);

    switch (contentType) {
      case activitySubTypeKeys.url: {
        const respUrl = await AgendaApi.editOne({ video: contentSource }, activityEdit, cEvent.value._id);
        if (respUrl) {
          await saveConfig({
            platformNew: '',
            type: activitySubTypeKeys.url,
            habilitar_ingreso: '',
            data: contentSource,
          });
          setTypeActivity(activitySubTypeKeys.url);
          setPlatform('wowza');
          setMeetingId(contentSource);
        }
        break;
      }
      case activitySubTypeKeys.vimeo: {
        const resp = await saveConfig({ platformNew: 'vimeo', type: 'vimeo', data: contentSource });
        setTypeActivity(activitySubTypeKeys.vimeo);
        setPlatform(activitySubTypeKeys.vimeo);
        setMeetingId(contentSource);
        break;
      }
      case activitySubTypeKeys.youtube: {
        if (!contentSource) {
          console.error('ActivityTypeProvider: contentSource is none');
          return;
        }
        let newData = contentSource.includes('https://youtu.be/')
          ? contentSource
          : 'https://youtu.be/' + contentSource;
        const resp = await saveConfig({ platformNew: 'wowza', type: activitySubTypeKeys.youtube, data: newData });
        setTypeActivity('youTube');
        setPlatform('wowza');
        setMeetingId(contentSource);
        break;
      }
      case activitySubTypeKeys.meeting: {
        const resp = await saveConfig({
          platformNew: '',
          type: activitySubTypeKeys.meeting,
          data: contentSource,
          habilitar_ingreso: 'only',
        });
        setTypeActivity(activitySubTypeKeys.meeting);
        setPlatform('wowza');
        break;
      }
      case activitySubTypeKeys.file: {
        if (!contentSource) {
          console.error('ActivityTypeProvider: contentSource is none');
          return;
        }
        const data = contentSource.split('*');
        const urlVideo = data[0];
        const respUrlVideo = await AgendaApi.editOne({ video: urlVideo }, activityEdit, cEvent.value._id);
        if (respUrlVideo) {
          const resp = await saveConfig({ platformNew: '', type: 'video', data: urlVideo, habilitar_ingreso: '' });
          setTypeActivity('video');
          setPlatform('wowza');
          setMeetingId(urlVideo);
        }
        break;
      }
      case activitySubTypeKeys.meet: {
        !meetingId && executer_createStream.mutate();
        meetingId &&
          (await saveConfig({
            platformNew: 'wowza',
            type: contentType,
            data: meetingId,
          }));
        setTypeActivity(activitySubTypeKeys.meet);
        setPlatform('wowza');
        break;
      }
      case activitySubTypeKeys.rtmp: {
        !meetingId && executer_createStream.mutate();
        meetingId &&
          (await saveConfig({ platformNew: 'wowza', type: contentType, data: meetingId }));
        setTypeActivity(activitySubTypeKeys.rtmp);
        setPlatform('wowza');
        break;
      }
      default:
        // alert(`wtf is ${contentType}`);
        console.warn(`wtf is ${contentType}`);
    }
  };

  const executer_createStream = useMutation(() => createLiveStream(activityName), {
    onSuccess: async (data: any) => {
      queryClient.setQueryData('livestream', data);

      await saveConfig({ platformNew: 'wowza', type: activityContentType, data: data.id });
      setDataLive(data);
      activityDispatch({ type: 'meeting_created', meeting_id: data.id });
    },
  });

  const executer_stopStream = async () => {
    setIsStoppingStreaming(true);
    const liveStreamresponse = await stopLiveStream(meetingId);
    setDataLive(liveStreamresponse);
    setIsStoppingStreaming(false);
    setHabilitarIngreso('ended_meeting_room');
    await saveConfig({ habilitar_ingreso: 'ended_meeting_room' });
  };

  const visualizeVideo = (url: string | null, created_at: string | null, name: string | null) => {
    url !== null ? setVideoObject({ url, created_at, name }) : setVideoObject(null);
  };

  const value: ActivityTypeContextType = {
    // Flags
    is: {
      stoppingStreaming: isStoppingStreaming,
      creating: isCreatingActivityType,
      deleting: isDeletingActivityType,
      saving: isSavingActivityType,
      updatingActivityType: isUpdatingActivityType,
      updatingActivityContent: isUpdatingActivityContent,
    },
    // Objects
    formWidgetFlow: activityTypeData,
    videoObject,
    activityType,
    contentSource,
    activityContentType,
    // Functions
    setActivityType,
    saveActivityType,
    deleteActivityType,
    resetActivityType,
    setContentSource,
    saveActivityContent,
    setActivityContentType,
    translateActivityType,
    visualizeVideo,
    executer_stopStream,
  };

  useEffect(() => {
    const request = async () => {
      if (!(cEvent?.value?._id)) {
        console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
        return;
      }

      try {
        setIsUpdatingActivityType(true);
        const agendaInfo: ExtendedAgendaDocumentType = await AgendaApi
          .getOne(activityEdit, cEvent.value._id);
        // setDefinedType(agendaInfo.type?.name || null);
        const typeIncoming = agendaInfo.type?.name as ActivityTypeName;

        const onlyActivityTypes: ActivityTypeName[] = [
          'liveBroadcast',
          'meeting',
          'video',
        ];

        const theseAreLiveToo: ActivitySubTypeName[] = ['RTMP', 'eviusMeet', 'vimeo', 'youTube'];
        const theseAreMeeting: ActivitySubTypeName[] = ['meeting'];
        const theseAreVideo: ActivitySubTypeName[] = ['url', 'cargarvideo'];

        if (typeIncoming) {
          if (onlyActivityTypes.includes(typeIncoming)) {
            console.debug(typeIncoming, 'is in', onlyActivityTypes);
            setActivityType(typeIncoming);
            setActivityContentType(null);
          } else {
            console.debug(typeIncoming, 'is not in', onlyActivityTypes);

            setActivityContentType(typeIncoming as ActivitySubTypeName);

            if (theseAreLiveToo.includes(typeIncoming as ActivitySubTypeName)) {
              setActivityType('liveBroadcast');
            } else if (theseAreVideo.includes(typeIncoming as ActivitySubTypeName)) {
              setActivityType('video');
            } else if (theseAreMeeting.includes(typeIncoming as ActivitySubTypeName)) {
              setActivityType('meeting');
            } else {
              console.warn('set activity type as null because', typeIncoming, 'is weird');
              setActivityType(null);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsUpdatingActivityType(false);
      }
    };
    if (activityEdit) {
      request().then(() => {});
    }
  }, [activityEdit]);

  return (
    <ActivityTypeContext.Provider value={value}>
      {props.children}
    </ActivityTypeContext.Provider>
  );
}

export default ActivityTypeProvider;
