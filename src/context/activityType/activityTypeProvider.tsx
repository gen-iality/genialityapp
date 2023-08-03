/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { message } from 'antd';
import { useContext, useEffect, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createLiveStream, stopLiveStream } from '../../adaptors/gcoreStreamingApi';
import { AgendaApi, TypesAgendaApi } from '../../helpers/request';
import AgendaContext from '../AgendaContext';
import { CurrentEventContext } from '../eventContext';

import ActivityTypeContext from './activityTypeContext';
import type { ActivityType } from './types/activityType';
import { WidgetType, MainUI } from './constants/enum';

import {
  ActivityTypeProviderProps,
  ActivityTypeContextType,
  OpenedWidget,
} from './types/contextType';
import { activityContentValues, formWidgetFlow, activityTypeNames, typeToDisplaymentMap } from './constants/ui';
// Temporally
import { ExtendedAgendaType } from '@Utilities/types/AgendaType';

const onlyActivityTypes: ActivityType.Name[] = [
  'liveBroadcast',
  'meeting2',
  'video',
  'quizing2',
  'survey2',
];
const theseAreLiveToo: ActivityType.ContentValue[] = ['RTMP', 'eviusMeet', 'vimeo', 'youTube'];
const theseAreMeeting: ActivityType.ContentValue[] = ['meeting'];
const theseAreVideo: ActivityType.ContentValue[] = ['url', 'cargarvideo'];

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
  const [activityType, setActivityType] = useState<ActivityType.Name | null>(null);
  const [activityContentType, setActivityContentType] = useState<ActivityType.ContentValue | null>(null);
  const [contentSource, setContentSource] = useState<string | null>(meetingId || null);
  const [videoId, setVideoId] = useState<string | null>()

  const queryClient = useQueryClient();

  const translateActivityType = useCallback((type: string) => {
    const value = typeToDisplaymentMap[type as keyof typeof typeToDisplaymentMap];
    if (!value) {
      console.error(`transpilerActivityType cannot find ${type} in ${typeToDisplaymentMap}`);
      return null;
    }
    return value;
  }, []);

  const humanizeActivityType = useCallback((typeIncoming: string): string => {
    type TypeIncoming = ActivityType.Name;
    switch (typeIncoming as TypeIncoming) {
      case MainUI.LIVE: return 'transmisión';
      case MainUI.MEETING: return 'reunión';
      case MainUI.QUIZ: return 'quiz';
      case MainUI.SURVEY: return 'encuesta';
      case MainUI.VIDEO: return 'vídeo';
      default: return typeIncoming;
    }
  }, []);

  const editActivityType = async (eventId: string, activityId: string, typeName: string) => {
    const createTypeActivityBody: any = { name: typeName };
    const activityTypeDocument = await TypesAgendaApi
      .create(cEvent.value._id, createTypeActivityBody);
    const agenda: ExtendedAgendaType = await AgendaApi
      .editOne({ type_id: activityTypeDocument._id }, activityId, eventId);
    return agenda;
  }

  const saveActivityType = async () => {
    /* console.debug('activity type provider is saving...');
    console.debug('activityType is:', activityType); */
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
      /* console.debug('activity type changes:', agenda);
      console.debug('AT provider saves successfully'); */
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

    /* console.debug('AT provider is deleting'); */

    setIsDeletingActivityType(true);

    setContentSource(null);
    setActivityContentType(null);
    try {
      await TypesAgendaApi.deleteOne(activityEdit, cEvent.value._id);
      /* console.debug('AT provider delete successfully'); */
    } catch (err) {
      console.error('no puede eliminar tipo de actividad:', err);
    } finally {
      setIsDeletingActivityType(false);
      setActivityType(null);
    }
  };

  const resetActivityType = async (type: ActivityType.Name) => {
    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.resetActivityType cannot get cEvent.value._id');
      return;
    }

    if (!activityEdit) {
      console.error('activityEdit (from AgendaContext) is none');
      return;
    }

    /* console.debug('AT provider is reseting'); */

    setIsDeletingActivityType(true);
    setActivityContentType(null);
    await editActivityType(cEvent.value._id, activityEdit, type);
    setIsDeletingActivityType(false);
  }

  const saveActivityContent = async (type?: ActivityType.ContentValue, data?: string | null) => {
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
    if (data) setContentSource(data);
    const contentType = activityContentType || type;
    const inputContentSource = contentSource || data;

    if (!contentType) {
      console.error('ActivityTypeProvider.saveActivityContent: content type must not be none');
      return;
    }

    /* console.debug('contentType:', contentType); */

    setIsUpdatingActivityContent(true);

    /* const agenda = */ editActivityType(cEvent.value._id, activityEdit, contentType).then(() => console.debug('editActivityType called during saving'));

    switch (contentType) {
      case activityContentValues.url: {
        const respUrl = await AgendaApi.editOne({ video: inputContentSource }, activityEdit, cEvent.value._id);
        if (respUrl) {
          await saveConfig({
            platformNew: '',
            type: activityContentValues.url,
            habilitar_ingreso: '',
            data: inputContentSource,
          });
          setTypeActivity(activityContentValues.url);
          setPlatform('wowza');
          setMeetingId(inputContentSource);
        }
        break;
      }
      case activityContentValues.vimeo: {
        const resp = await saveConfig({ platformNew: 'vimeo', type: 'vimeo', data: inputContentSource });
        setTypeActivity(activityContentValues.vimeo);
        setPlatform(activityContentValues.vimeo);
        setMeetingId(inputContentSource);
        break;
      }
      case activityContentValues.youtube: {
        if (!inputContentSource) {
          console.error('ActivityTypeProvider: contentSource is none');
          return;
        }
        let newData = inputContentSource.includes('https://youtu.be/')
          ? inputContentSource
          : 'https://youtu.be/' + inputContentSource;
        const resp = await saveConfig({ platformNew: 'wowza', type: activityContentValues.youtube, data: newData });
        setTypeActivity('youTube');
        setPlatform('wowza');
        setMeetingId(inputContentSource);
        break;
      }
      case activityContentValues.meeting: {
        const resp = await saveConfig({
          platformNew: '',
          type: activityContentValues.meeting,
          data: inputContentSource,
          habilitar_ingreso: 'only',
        });
        setTypeActivity(activityContentValues.meeting);
        setPlatform('wowza');
        break;
      }
      case activityContentValues.file: {
        if (!inputContentSource) {
          console.error('ActivityTypeProvider: contentSource is none');
          return;
        }
        const data = inputContentSource.split('*');
        const urlVideo = data[0];
        let editActivity: any = { video: urlVideo }

        if(videoId){
          editActivity.videoId = videoId
        }
        const respUrlVideo = await AgendaApi.editOne(editActivity, activityEdit, cEvent.value._id);
        if (respUrlVideo) {
          const resp = await saveConfig({ platformNew: '', type: 'video', data: urlVideo, habilitar_ingreso: '' });
          setTypeActivity('video');
          setPlatform('wowza');
          setMeetingId(urlVideo);
        }
        break;
      }
      case activityContentValues.meet: {
        !meetingId && executer_createStream.mutate();
        meetingId &&
          (await saveConfig({
            platformNew: 'wowza',
            type: contentType,
            data: meetingId,
          }));
        setTypeActivity(activityContentValues.meet);
        setPlatform('wowza');
        break;
      }
      case activityContentValues.rtmp: {
        !meetingId && executer_createStream.mutate();
        meetingId &&
          (await saveConfig({ platformNew: 'wowza', type: contentType, data: meetingId }));
        setTypeActivity(activityContentValues.rtmp);
        setPlatform('wowza');
        break;
      }
      case activityContentValues.survey: {
        if (!inputContentSource) {
          console.error('ActivityTypeProvider: contentSource is none:', inputContentSource);
          return;
        }
        await saveConfig({ platformNew: '', type: contentType, data: inputContentSource });
        setTypeActivity(activityContentValues.survey);
        setMeetingId(inputContentSource);
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
    if (!!meetingId) {
      const liveStreamresponse = await stopLiveStream(meetingId);
      setDataLive(liveStreamresponse);
    }
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
    formWidgetFlow: formWidgetFlow,
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
    videoId,
    setVideoId,
    saveActivityContent,
    setActivityContentType,
    translateActivityType,
    visualizeVideo,
    executer_stopStream,
    humanizeActivityType,
  };

  useEffect(() => {
    /* console.debug('activityEdit changed, refresh activityTypeProvider data'); */
    const request = async () => {
      if (!(cEvent?.value?._id)) {
        console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
        return;
      }

      try {
        setIsUpdatingActivityType(true);
        const agendaInfo: ExtendedAgendaType = await AgendaApi
          .getOne(activityEdit, cEvent.value._id);
        // setDefinedType(agendaInfo.type?.name || null);
        const typeIncoming = agendaInfo.type?.name as ActivityType.Name;

        if (typeIncoming) {
          if (onlyActivityTypes.includes(typeIncoming)) {
            console.debug(typeIncoming, 'is in', onlyActivityTypes);
            setActivityType(typeIncoming);
            setActivityContentType(null);
          } else {
            /* console.debug(typeIncoming, 'is not in', onlyActivityTypes); */

            setActivityContentType(typeIncoming as ActivityType.ContentValue);

            // Load the content source from agenda

            if (theseAreLiveToo.includes(typeIncoming as ActivityType.ContentValue)) {
              setActivityType(MainUI.LIVE);
              setContentSource(meetingId);
              /* console.debug('from beginning contentSource is going to be:', meetingId); */
            } else if (theseAreVideo.includes(typeIncoming as ActivityType.ContentValue)) {
              setActivityType(MainUI.VIDEO);
              setContentSource(agendaInfo.video || null);
              setVideoId(agendaInfo.videoId)
              /* console.debug('from beginning contentSource is going to be:', agendaInfo.video || null); */
            } else if (theseAreMeeting.includes(typeIncoming as ActivityType.ContentValue)) {
              setActivityType(MainUI.MEETING);
              setContentSource(meetingId);
              /* console.debug('from beginning contentSource is going to be:', meetingId); */
            } else if (['quizing', 'quiz'].includes(typeIncoming as ActivityType.ContentValue)) {
              setActivityType(MainUI.QUIZ);
              setContentSource(meetingId);
              /* console.debug('from beginning contentSource is going to be:', meetingId); */
            } else if ((typeIncoming as ActivityType.ContentValue) === 'survey') {
              setActivityType(MainUI.SURVEY);
              setContentSource(meetingId);
              /* console.debug('from beginning contentSource is going to be:', meetingId); */
            } else {
              /* console.warn('set activity type as null because', typeIncoming, 'is weird'); */
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

  useEffect(() => {
    if (!contentSource && !!meetingId && !!activityContentType && (theseAreLiveToo.includes(activityContentType) || theseAreMeeting.includes(activityContentType) || ['survey', 'quiz', 'quizing'].includes(activityContentType))) {
      /* console.debug('reset contentSource to meetingId:', meetingId); */
      setContentSource(meetingId);
    }
  }, [meetingId]);

  return (
    <ActivityTypeContext.Provider value={value}>
      {props.children}
    </ActivityTypeContext.Provider>
  );
}

export default ActivityTypeProvider;
