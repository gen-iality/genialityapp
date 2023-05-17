import { Button, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react';
import useListeningMessage from '../hooks/useListeningMessage';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';

interface IMessageListProps {
  eventId: string;
}

const renderMensaje = (text: string, record: any) => (
  <Tooltip title={record.text} placement='topLeft'>
    <Tag color='#3895FA'>{record.text}</Tag>
  </Tooltip>
);

const columns = [
  {
    title: 'Usuario',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
  },

  {
    title: 'Mensaje',
    key: 'text',
    dataIndex: 'text',
    ellipsis: true,
    render: renderMensaje,
  },
  {
    title: 'Fecha',
    dataIndex: 'hora',
    key: 'hora',
    width: 150,
    ellipsis: true,
  },
];

const MessageList = ({ eventId }: IMessageListProps) => {
  const { messages, isLoading } = useListeningMessage(eventId);
  return (
    <>
      <Table
        loading={isLoading}
        columns={[
          ...columns,
          {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
              <Space size='middle'>
                <Button type='primary' icon={<CheckCircleOutlined />}>
                  Aprobar
                </Button>
                <Button icon={<DeleteOutlined />}>Desaprobar</Button>
              </Space>
            ),
          },
        ]}
        dataSource={messages.map((message) => {
          return {
            name: message.name,
            text: message.text,
            hora: message.timestamp,
            key: message.id,
          };
        })}
      />
    </>
  );
};

export default MessageList;
