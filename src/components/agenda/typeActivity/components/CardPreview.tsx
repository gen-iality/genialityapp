import { Card, Typography, Space, Select, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import { CheckCircleOutlined, StopOutlined, YoutubeFilled } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import { useContext, useEffect, useState } from 'react';
import AgendaContext from '../../../../context/AgendaContext';
import VimeoIcon from '@2fd/ant-design-icons/lib/Vimeo';

const CardPreview = (props: any) => {
  const [duration, setDuration] = useState(0);
  const { data } = useTypeActivity();
  const { roomStatus, setRoomStatus, dataLive, meeting_id } = useContext(AgendaContext);
  //OBTENER URL A RENDERIZAR EN COMPONENTE DE VIDEO

  const renderPlayer = () => {
    console.log('SE EJECUTA EL RENDER PLAYER');
    const urlVideo =
      props.type !== 'Video' && props.type !== 'Youtube' && props.type !== 'vimeo'
        ? dataLive && dataLive?.live && dataLive?.hls_playlist_url
          ? dataLive?.hls_playlist_url
          : 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807'
        : props.type == 'Youtube'
        ? data
          ? data?.includes('https://youtu.be/')
            ? data
            : 'https://youtu.be/' + data
          : props.type === 'vimeo'
          ? data?.includes('https://vimeo.com/event/')
            ? data
            : 'https://vimeo.com/event/' + data
          : data
        : data;
    console.log('URL DEL VIDEO===>', urlVideo);
    return (
      <ReactPlayer
        onDuration={props.type === 'Video' ? handleDuration : undefined}
        style={{ objectFit: 'cover' }}
        width='100%'
        height='100%'
        url={urlVideo}
        controls
      />
    );
  };

  console.log('99. DATA TRANSMITION===>', dataLive?.live, dataLive?.hls_playlist_url);

  //PERMITE VERIFICAR IDS Y NO MOSTRAR LA URL COMPLETA DE YOUTUBE Y VIMEO
  const filterData = data
    ? data.toString()?.includes('https://vimeo.com/event/') || data?.toString().includes('https://youtu.be/')
      ? data?.split('/')[data?.split('/').length - 1]
      : data
    : meeting_id
    ? meeting_id
    : null;

  const handleDuration = (duration: number) => {
    console.log('onDuration', duration);
    setDuration(duration);
  };

  function videoDuration(seconds: number) {
    var hour: number | string = Math.floor(seconds / 3600);
    var minute: number | string = Math.floor((seconds / 60) % 60);
    var second: number | string = seconds % 60;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    if (hour == 0) return minute + ':' + second;
    return hour + ':' + minute + ':' + second;
  }

  return (
    <Card
      cover={
        props.type === 'reunión' && (
          <img
            style={{ objectFit: 'cover' }}
            height={'250px'}
            src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b'
          />
        )
      }
      bodyStyle={{ padding: '21px' }}
      style={{ borderRadius: '8px' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <div className='mediaplayer' style={{ borderRadius: '8px' }}>
          {props?.type !== 'reunión' && renderPlayer()}
        </div>
        <Card.Meta
          avatar={
            props.type === 'reunión' || props.type === 'Video' ? null : (
              <Avatar
                icon={
                  props.type === 'EviusMeet' ? (
                    dataLive?.active ? (
                      <CheckCircleOutlined />
                    ) : (
                      <StopOutlined />
                    )
                  ) : props.type === 'vimeo' ? (
                    <VimeoIcon />
                  ) : (
                    props.type === 'Youtube' && <YoutubeFilled />
                  )
                }
                style={
                  props.type === 'EviusMeet'
                    ? dataLive?.active
                      ? { backgroundColor: 'rgba(82, 196, 26, 0.1)', color: '#52C41A' }
                      : { backgroundColor: 'rgba(255, 77, 79, 0.1)', color: '#FF4D4F' }
                    : props.type === 'vimeo'
                    ? { backgroundColor: 'rgba(26, 183, 234, 0.1)', color: '#32B8E8' }
                    : (props.type === 'Youtube' && { backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#FF0000' }) ||
                      undefined
                }
              />
            )
          }
          title={
            <Typography.Text style={{ fontSize: '20px' }} strong>
              {props.activityName}
            </Typography.Text>
          }
          description={
            props.type == 'reunión' ? (
              'Sala de reuniones'
            ) : props.type === 'Video' ? (
              videoDuration(duration)
            ) : props.type === 'vimeo' || props.type == 'Youtube' ? (
              'Conexión externa'
            ) : dataLive?.active ? (
              <Typography.Text type='success'>Iniciado</Typography.Text>
            ) : (
              <Typography.Text type='danger'>Detenido</Typography.Text>
            )
          }
        />
        {(props.type === 'Transmisión' || props.type === 'vimeo' || props.type == 'Youtube') && (
          <Space style={{ width: '100%' }}>
            <Typography.Text strong>ID {props.type}:</Typography.Text>
            <Typography.Text
              copyable={{
                tooltips: ['clic para copiar', 'ID copiado!!'],
                text: `${filterData}`,
              }}>
              {filterData}
            </Typography.Text>
          </Space>
        )}
        {((dataLive?.active && (props.type === 'Transmisión' || props.type === 'EviusMeet')) ||
          (props.type !== 'Transmisión' && props.type !== 'EviusMeet')) && (
          <Space direction='vertical' style={{ width: '100%' }}>
            <Typography.Text strong>Estado de la actividad para tus asistentes: </Typography.Text>
            <Select
              value={roomStatus}
              onChange={(value) => {
                setRoomStatus(value);
              }}
              style={{ width: '100%' }}>
              <Select.Option value=''>Actividad creada</Select.Option>
              <Select.Option value='closed_meeting_room'>Iniciará pronto</Select.Option>
              <Select.Option value='open_meeting_room'>En vivo</Select.Option>
              <Select.Option value='ended_meeting_room'>Finalizada</Select.Option>
            </Select>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default CardPreview;
