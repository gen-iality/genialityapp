import React, { useEffect, useState } from 'react';
import { listeningMessages } from '@/components/games/bingo/services';
import { IMessage } from '../interface/message.interface';

const useListeningMessage = (eventId: string) => {
  const [messages, setmessages] = useState<IMessage[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const onSetMessager = (messageList: IMessage[]) => {
    setmessages(messageList);
    setisLoading(false);
  };

  useEffect(() => {
    const unsusbcribe = listeningMessages(eventId, onSetMessager);
    return () => {
      unsusbcribe();
    };
  }, [eventId]);

  return {
    messages,
    isLoading,
  };
};

export default useListeningMessage;
