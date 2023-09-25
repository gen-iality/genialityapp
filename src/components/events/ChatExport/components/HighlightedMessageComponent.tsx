import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { updateConfigChat } from '@/components/games/bingo/services';
interface HighlightedMessageComponentProps {
  eventId: string;
  highlightedMessage: string;
}
const { TextArea } = Input;
const HighlightedMessageComponent: React.FC<HighlightedMessageComponentProps> = ({ eventId, highlightedMessage }) => {
  const [highlightedMessages, setHighlightedMessage] = useState(highlightedMessage);
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHighlightedMessage(event.target.value);
  };
  const handleSendButtonClick = async () => {
    try {
      //@ts-ignore
      const resUpdate = await updateConfigChat(eventId, { message_highlighted: highlightedMessages });
      if (resUpdate) {
        message.success('Mensaje guardado correctamente');
      } else {
        message.error('Error al guardar el mensaje');
      }
    } catch (error) {
      message.error('Ocurrió un error al guardar el mensaje');
    }
  };
  return (
    <Form layout='vertical'>
      <Form.Item label='Escribe el mensaje que quieres mostrar en el chat'>
        <TextArea
          showCount
          allowClear
          autoSize={{ minRows: 4, maxRows: 4 }}
          maxLength={200}
          onChange={handleTextAreaChange}
          value={highlightedMessages}
        />
        <Typography.Text type='secondary' >
          Elimine el contenido del mensaje y guarde para que no se muestre en el chat.
        </Typography.Text >
      </Form.Item>
      <Button type='primary' onClick={handleSendButtonClick}>
        Guardar
      </Button>
    </Form>
  );
};
export default HighlightedMessageComponent;