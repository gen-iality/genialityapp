import { listeningMessages } from '@/components/games/bingo/services';
import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export interface IMessage {
  id: string;
  profilePicUrl: string;
  name: string;
  sortByDateAndTime: string;
  fecha: {
    seconds: Timestamp;
    nanoseconds: Timestamp;
  };
  visible: boolean;
  type: string;
  idparticipant: string;
  text: string;
  timestamp: Timestamp;
  iduser: string;
}
const useListeningMessage = (eventId: string) => {
  const [messages, setmessages] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const onSetMessager = (messageList: any[]) => {
    setmessages(messageList);
    setisLoading(false);
  };
  console.log('messages', messages);
  useEffect(() => {
    const unsusbcribe = listeningMessages(eventId, onSetMessager);
    return () => {
      unsusbcribe();
    };
  }, []);

  return {
    messages,
    isLoading,
  };
};

export default useListeningMessage;
