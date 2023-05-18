import React, { useEffect, useState } from 'react';
import { Form, Switch } from 'antd';
import MessageList from './components/MessageList';
import useGetEventConfig from './hooks/useGetEventConfig';
import { updateConfigChat } from '@/components/games/bingo/services';
import useListeningConfigChat from './hooks/useListeningConfigChat';

interface IChatSettingsProps {
  eventId: string;
}
const ChatSettings = ({ eventId }: IChatSettingsProps) => {
  const { eventConfigChat, isLoading } = useGetEventConfig(eventId);
  const [controlled, setControlled] = useState(false);
  const [isChangeControlled, setIsChangeControlled] = useState(false);

  const onChangeControlled = async (controlled: boolean) => {
    setIsChangeControlled(true);
    const resUpdate = await updateConfigChat(eventId, { message_controlled: controlled });
    if (resUpdate) setControlled(controlled);
    setIsChangeControlled(false);
  };

  useEffect(() => {
    if (!eventConfigChat) return;
    setControlled(eventConfigChat.message_controlled ?? false);
  }, [eventConfigChat]);

  return (
    <>
      <Form layout='vertical'>
        <Form.Item label={'Chats controlados'}>
          <Switch
            loading={isChangeControlled || isLoading}
            style={{ marginLeft: 10 }}
            checked={controlled}
            checkedChildren='Si'
            unCheckedChildren='No'
            onChange={onChangeControlled}
          />
        </Form.Item>
      </Form>

      {controlled && <MessageList eventId={eventId} />}
    </>
  );
};

export default ChatSettings;
