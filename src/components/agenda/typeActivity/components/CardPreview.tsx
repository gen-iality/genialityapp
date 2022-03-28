import { Card, Typography, Space, Select, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import { useContext, useState } from 'react';
import AgendaContext from '../../../../context/AgendaContext';

const CardPreview = (props: any) => {
  const [duration, setDuration] = useState(0);
  const { data } = useTypeActivity();
  const { roomStatus, setRoomStatus, dataLive } = useContext(AgendaContext);
  console.log('100. TYPE==>', props.type);
  const urlVideo =
    props.type !== 'Video'
      ? dataLive && dataLive?.live
        ? dataLive?.hls_playlist_url
        : 'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FLoading2.mp4?alt=media&token=8d898c96-b616-4906-ad58-1f426c0ad807'
      : data;



  const handleDuration = (duration: number) => {
    console.log('onDuration', duration);
    setDuration(duration);
  };

  function videoDuration(seconds) {
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
    <Card cover={props.type === 'reunión' && <img style={{ objectFit: 'cover' }} height={'250px'} src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Freunion.jpg?alt=media&token=79983d40-cb24-4ca2-9a19-794a5eeb825b' />} bodyStyle={{ padding: '21px' }} style={{ borderRadius: '8px' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <div className='mediaplayer' style={{ borderRadius: '8px' }}>
          {props.type !== 'reunión' &&
            <ReactPlayer onDuration={props.type === 'Video' ? handleDuration : null} style={{ objectFit: 'cover' }} width='100%' height='100%' url={urlVideo} controls />
          }
        </div>
        <Card.Meta
          avatar={
            props.type === 'reunión' || props.type === 'Video' ? null :
              <Avatar >
                <CheckCircleOutlined />
              </Avatar>
          }
          title={
            <Typography.Text style={{ fontSize: '20px' }} strong>
              {props.activityName}
            </Typography.Text>
          }
          description={
            props.type == 'reunión'
              ? 'Sala de reuniones' : props.type === 'Video' ? videoDuration(duration)
                : props.type === 'vimeo' || props.type == 'Youtube'
                  ? ''
                  : 'Estado'
          }
        />
        {(props.type === 'Transmisión' || props.type === 'vimeo' || props.type == 'Youtube') && (
          <Space style={{ width: '100%' }}>
            <Typography.Text strong>ID {props.type}:</Typography.Text>
            <Typography.Text
              copyable={{
                tooltips: ['clic para copiar', 'ID copiado!!'],
                text: `${data}`,
              }}>
              {data}
            </Typography.Text>
          </Space>
        )}
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
      </Space>
    </Card >
  );
};

export default CardPreview;
