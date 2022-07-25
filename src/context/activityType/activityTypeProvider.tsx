import { message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createLiveStream, stopLiveStream } from '../../adaptors/gcoreStreamingApi';
import { AgendaApi, TypesAgendaApi } from '../../helpers/request';
import AgendaContext from '../AgendaContext';
import { CurrentEventContext } from '../eventContext';

import ActivityTypeContext from './activityTypeContext';
import { ActivityTypeValueType } from './schema/structureInterfaces';
import {
  ActivityTypeProviderProps,
  ActivityTypeContextType,
} from './types/types';
import { activityTypeData } from './schema/activityTypeFormStructure';
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
    meeting_id,
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
  const [videoObject, setVideoObject] = useState<any | null>(null);
  const [activityType, setActivityType] = useState<ActivityTypeValueType | null>(null);

  const queryClient = useQueryClient();

  const saveActivityType = () => {
    console.debug('activity type provider is saving...');
    console.debug('activityType is:', activityType);
    if (activityType === null) return;
    if (!(cEvent?.value?._id)) {
      console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
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
      console.error('ActivityTypeProvider.saveActivityType cannot get cEvent.value._id');
      return;
    }
    console.debug('AT provider is deleting');

    setIsDeletingActivityType(true);
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

  const value: ActivityTypeContextType = {
    // Flags
    is: {
      stoppingStreaming: isStoppingStreaming,
      creating: isCreatingActivityType,
      deleting: isDeletingActivityType,
      saving: isSavingActivityType,
      updatingActivityType: isUpdatingAcctivityType,
    },
    // Objects
    formWidgetFlow: activityTypeData,
    videoObject,
    activityType,
    // Functions
    setActivityType,
    saveActivityType,
    deleteActivityType,
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
        const typeIncomming = agendaInfo.type?.name as ActivityTypeValueType;
        if (typeIncomming) setActivityType(typeIncomming);
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