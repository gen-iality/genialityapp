import { message } from 'antd';
import { useContext, useReducer, useState } from 'react';
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
  const [videoObject, setVideoObject] = useState<any | null>(null);
  const [activityType, setActivityType] = useState<ActivityTypeValueType | null>(null);

  const queryClient = useQueryClient();

  const saveActivityType = () => {
    console.log('activityType is:', activityType)
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
      console.log('agenda: activity type changes:', agenda);
    };

    promise()
      .then(() => setIsSavingActivityType(false))
      .catch((err) => {
        console.error(err);
        setIsSavingActivityType(false);
      });
  }

  const value: ActivityTypeContextType = {
    // Flags
    isStoppingStreaming,
    isCreatingActivityType,
    // Objects
    formWidgetFlow: activityTypeData,
    videoObject,
    activityType,
    // Functions
    setActivityType,
    saveActivityType,
  };

  return (
    <ActivityTypeContext.Provider value={value}>
      {props.children}
    </ActivityTypeContext.Provider>
  );
}

export default ActivityTypeProvider;