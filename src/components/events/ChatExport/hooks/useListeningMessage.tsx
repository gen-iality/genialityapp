import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';

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
const useListeningMessage = () => {
  const [messages, setmessages] = useState([]);
  return {};
};

export default useListeningMessage;
