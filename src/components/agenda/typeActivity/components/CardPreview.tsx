import React from 'react';
import { Card, Typography, Space, Select, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import { CheckCircleOutlined } from '@ant-design/icons';

const CardPreview = () => {
  return (
    <Card bodyStyle={{ padding: '21px' }} style={{ borderRadius: '8px' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <div className='mediaplayer' style={{ borderRadius: '8px' }}>
          <ReactPlayer
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            url={
              'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807'
            }
            controls
          />
        </div>
        <Card.Meta
          avatar={
            <Avatar>
              <CheckCircleOutlined />
            </Avatar>
          }
          title={
            <Typography.Text style={{ fontSize: '20px' }} strong>
              Nombre de la actividad
            </Typography.Text>
          }
          description='Estado'
        />
        <Space style={{ width: '100%' }}>
          <Typography.Text strong>ID transmisión:</Typography.Text>
          <Typography.Text
            copyable={{
              tooltips: ['clic para copiar', 'ID copiado!!'],
              text: 'Aquí va el ID a copiar',
            }}>
            {'HJASDD'}
          </Typography.Text>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text strong>Estado de la actividad para tus asistentes: </Typography.Text>
          <Select
            /* value={roomStatus}
            onChange={(value) => {
              setRoomStatus(value);
            }} */
            style={{ width: '100%' }}>
            <Select.Option value=''>Actividad creada</Select.Option>
            <Select.Option value='closed_meeting_room'>Iniciará pronto</Select.Option>
            <Select.Option value='open_meeting_room'>En vivo</Select.Option>
            <Select.Option value='ended_meeting_room'>Finalizada</Select.Option>
          </Select>
        </Space>
      </Space>
    </Card>
  );
};

export default CardPreview;
