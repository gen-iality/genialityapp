import moment from 'moment';
import React, { useEffect, useState } from 'react';
import useDateFormat from './useDateFormat';

type MeetingState = 'scheduled' | 'in-progress' | 'completed';

type StateMap<T1, T2, T3> = {
  scheduled: T1;
  'in-progress': T2;
  completed: T3;
};

const useMeetingState = <T1, T2, T3>(startMeeting: string | Date, endMeeting: string | Date, stateMap?: StateMap<T1, T2, T3>) => {
  const [stateMeeting, setStateMeeting] = useState<MeetingState>('scheduled');
  const { dateFormat } = useDateFormat();
  
  useEffect(() => {
    const currentDate = moment(new Date());
    
    if (currentDate.isBefore(dateFormat(startMeeting, 'MM/DD/YYYY hh:mm A'))) {
      setStateMeeting('scheduled');
    } else if (
      currentDate.isAfter(dateFormat(startMeeting, 'MM/DD/YYYY hh:mm A')) &&
      currentDate.isBefore(dateFormat(endMeeting, 'MM/DD/YYYY hh:mm A'))
    ) {
      setStateMeeting('in-progress');
    } else if (currentDate.isAfter(dateFormat(endMeeting, 'MM/DD/YYYY hh:mm A'))) {
      setStateMeeting('completed');
    }
  }, []);

  return {
    stateMeeting,
    setStateMeeting,
    valueByState: stateMap ? stateMap[stateMeeting] : undefined,
  };
};
export default useMeetingState;
