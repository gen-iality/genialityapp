import { Table } from 'antd';
import React from 'react';
import useListeningMessage from '../hooks/useListeningMessage';

interface IMessageListProps {
  eventId: string;
}
const MessageList = ({ eventId }: IMessageListProps) => {
  const { messages } = useListeningMessage(eventId);
  return (
    <>
      <Table />
    </>
  );
};

export default MessageList;
