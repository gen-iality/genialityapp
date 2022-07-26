import { message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createLiveStream, stopLiveStream } from '../../adaptors/gcoreStreamingApi';
import { AgendaApi, TypesAgendaApi } from '../../helpers/request';
import AgendaContext from '../AgendaContext';
import { CurrentEventContext } from '../eventContext';

import ActivityTypeContext from './activityTypeContext';
import { ActivitySubTypeValueType, ActivityTypeValueType } from './schema/structureInterfaces';
import {
  ActivityTypeProviderProps,
  ActivityTypeContextType,
} from './types/types';
import { activitySubTypeKeys, activityTypeData } from './schema/activityTypeFormStructure';
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
  const [isUpdatingAcctivityType, setIsUpdatingAcctivityType] = useState(false);
  const [isUpdatingActivityContent, setIsUpdatingActivityContent] = useState(false);
  const [videoObject, setVideoObject] = useState<any | null>(null);
  const [activityType, setActivityType] = useState<ActivityTypeValueType | null>(null);
  const [activityContentType, setActivityContentType] = useState<ActivitySubTypeValueType | null>(null);
  const [contentSource, setContentSource] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const saveActivityType = () => {
    console.debug('activity type provider is saving...');
    console.debug('activityType is:', activityType);
    if (activityType === null) {
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

    const promise = async () => {
      const createTypeActivityBody: any = { name: activityType };
      const activityTypeDocument = await TypesAgendaApi
        .create(cEvent.value._id, createTypeActivityBody);
      const agenda = await AgendaApi
        .editOne({ type_id: activityTypeDocument._id }, activityEdit, cEvent.value._id);
      console.debug('activity type changes:', agenda);
    };

    promise()
      .then(() => {
        setIsSavingActivityType(false);
        console.debug('AT provider stops successfully');
      })
      .catch((err) => {
        console.error(err);
        setIsSavingActivityType(false);
      });
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

  const saveActivityContent = () => {
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

    setIsUpdatingActivityContent(true);
    (async () => {
      switch (activityContentType) {
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
        case 'eviusMeet': {
          !meetingId && executer_createStream.mutate();
          meetingId &&
            (await saveConfig({
              platformNew: 'wowza',
              type: activityContentType,
              data: meetingId,
            }));
          setTypeActivity('eviusMeet');
          setPlatform('wowza');
          break;
        }
        case 'RTMP': {
          !meetingId && executer_createStream.mutate();
          meetingId &&
            (await saveConfig({ platformNew: 'wowza', type: activityContentType, data: meetingId }));
          setTypeActivity('RTMP');
          setPlatform('wowza');
          break;
        }
        default:
          // alert(`wtf is ${activityContentType}`);
          console.warn(`wtf is ${activityContentType}`);
      }
    })();
  };

  const executer_createStream = useMutation(() => createLiveStream(activityName), {
    onSuccess: async (data: any) => {
      queryClient.setQueryData('livestream', data);

      await saveConfig({ platformNew: 'wowza', type: activityContentType, data: data.id });
      setDataLive(data);
      activityDispatch({ type: 'meeting_created', meeting_id: data.id });
      // Invalidate and refetch
      //queryClient.invalidateQueries('todos')
    },
  });

  const value: ActivityTypeContextType = {
    // Flags
    is: {
      stoppingStreaming: isStoppingStreaming,
      creating: isCreatingActivityType,
      deleting: isDeletingActivityType,
      saving: isSavingActivityType,
      updatingActivityType: isUpdatingAcctivityType,
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
    setContentSource,
    saveActivityContent,
    setActivityContentType,
  };

  useEffect(() => {
    const request = async () => {
      if (!(cEvent?.value?._id)) {
        console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
        return;
      }

      try {
        setIsUpdatingAcctivityType(true);
        const agendaInfo: ExtendedAgendaDocumentType = await AgendaApi
          .getOne(activityEdit, cEvent.value._id);
        // setDefinedType(agendaInfo.type?.name || null);
        const typeIncoming = agendaInfo.type?.name as ActivityTypeValueType;

        const onlyActivityTypes: ActivityTypeValueType[] = [
          'liveBroadcast',
          'meeting',
          'video',
        ];

        if (typeIncoming) {
          if (onlyActivityTypes.includes(typeIncoming)) {
            console.debug(typeIncoming, 'is in', onlyActivityTypes);
            setActivityType(typeIncoming);
            setActivityContentType(null);
          } else {
            console.debug(typeIncoming, 'is not in', onlyActivityTypes);
            setActivityType(null);
            setActivityContentType(typeIncoming as ActivitySubTypeValueType);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsUpdatingAcctivityType(false);
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