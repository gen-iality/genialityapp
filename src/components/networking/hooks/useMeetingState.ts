import moment from 'moment';
import { useEffect, useState } from 'react';
import useDateFormat from './useDateFormat';

type MeetingState = 'scheduled' | 'in-progress' | 'completed';
type ResultStatus = 'success' | 'info' | 'warning';

const useMeetingState = (startMeeting: string | Date, endMeeting: string | Date) => {
  const [stateMeeting, setStateMeeting] = useState<MeetingState>('scheduled');
  const { dateFormat } = useDateFormat();
  const [messageByState, setMessageByState] = useState('')
  const [resultStatus, setResultStatus] = useState<ResultStatus>('info')


  useEffect(() => {
    const currentDate = moment(new Date());
    
    if (currentDate.isBefore(dateFormat(startMeeting, 'MM/DD/YYYY hh:mm A'))) {
      setStateMeeting('scheduled');
      setMessageByState('La reunión iniciará en :')
      setResultStatus('info');
      return;
    }
    if (
      currentDate.isAfter(dateFormat(startMeeting, 'MM/DD/YYYY hh:mm A')) &&
      currentDate.isBefore(dateFormat(endMeeting, 'MM/DD/YYYY hh:mm A'))
    ) {
      setStateMeeting('in-progress');
      setMessageByState('¡La reunión ha iniciado!');
      setResultStatus('success');
      return;
    }
    if (currentDate.isAfter(dateFormat(endMeeting, 'MM/DD/YYYY hh:mm A'))) {
      setStateMeeting('completed');
      setMessageByState('¡La reunión ha finalizado!');
      setResultStatus('warning');
      return;
    }
  }, [startMeeting, endMeeting]);

  
  return {
    stateMeeting,
    setStateMeeting,
    resultStatus,
    messageByState
  };
};
export default useMeetingState;
