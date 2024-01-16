import { useCallback, useEffect, useState } from 'react';
import { listeningAttendee } from '../services/attendee.service';
import { parseAttendeeListToChat } from '../helpers/parseAttendeeListToChat';
import { IAttendee } from '..';

export const useListeningAttendee = (eventId: string) => {
  const [attendeeList, setAttendeeList] = useState<IAttendee[]>([]);
  const [isLoadingAttendeeList, setIsLoading] = useState(true);

  const onSnapshotAttendee = useCallback(() => {
    setIsLoading(true);
    return listeningAttendee(eventId, (attendeeList: any[]) => {
      setAttendeeList(attendeeList);
    });
  }, [eventId]);

  useEffect(() => {
    const unSubscribe = onSnapshotAttendee();
    return () => {
      unSubscribe();
    };
  }, [onSnapshotAttendee]);

  return {
    attendeeList,
    isLoadingAttendeeList,
    attendeeListParsed: parseAttendeeListToChat(attendeeList),
  };
};
