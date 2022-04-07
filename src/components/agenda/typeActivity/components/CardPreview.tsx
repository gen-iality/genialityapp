import { Card, Typography, Space, Select, Avatar, Button, Spin, Comment, Row, Col, Badge, Popconfirm } from 'antd';
import ReactPlayer from 'react-player';
import { CheckCircleOutlined, StopOutlined, YoutubeFilled } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import { useContext, useEffect, useState } from 'react';
import AgendaContext from '../../../../context/AgendaContext';
import VimeoIcon from '@2fd/ant-design-icons/lib/Vimeo';
import { startRecordingLiveStream, stopRecordingLiveStream } from '@/adaptors/gcoreStreamingApi';

const CardPreview = (props: any) => {
  const [duration, setDuration] = useState(0);
  const { data } = useTypeActivity();
  const {
    roomStatus,
    setRoomStatus,
    dataLive,
    meeting_id,
    obtainUrl,
    recordings,
    startRecordTransmition,
    stopRecordTransmition,
    loadingRecord,
    record,
  } = useContext(AgendaContext);

  console.log('DATALIVE ===>', dataLive);
  //OBTENER URL A RENDERIZAR EN COMPONENTE DE VIDEO
  const valideUrl = (url: string) => {
    if (url.includes('Loading2')) {
      return false;
    } else {
      return true;
    }
  };

  //PERMITE RENDERIZAR EL COMPONENTE IFRAME O REACT PLAYER GCORE
  const renderPlayer = () => {
    //OBTENER VISIBILIDAD DEL REACT PLAYER Y URL A RENDERIZAR
    let { urlVideo, visibleReactPlayer } = obtainUrl(props.type, data);
    //RENDERIZAR COMPONENTE
    return (
      <>
        {visibleReactPlayer && (
          <ReactPlayer
            playing={true}
            loop={true}
            onDuration={props.type === 'Video' ? handleDuration : undefined}
            style={{ objectFit: 'cover', aspectRatio: '16/9' }}
            width='100%'
            height='100%'
            url={urlVideo}
            controls={true}
            onError={(e) => console.log('Error ==>', e)}
          />
        )}
        {!visibleReactPlayer && (
          <iframe
            style={{ aspectRatio: '16/9' }}
            width='100%'
            src={urlVideo + '?muted=1&autoplay=1'}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen></iframe>
        )}
      </>
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
      style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <div className='mediaplayer' style={{ borderRadius: '8px' }}>
          {props?.type !== 'reunión' && renderPlayer()}
        </div>
        <Row align='top' justify='space-between'>
          <Col span={dataLive?.live && dataLive?.active ? 16 : 24}>
            <Comment
              avatar={
                props.type === 'reunión' || props.type === 'Video' ? null : (
                  <Avatar
                    icon={
                      props.type === 'EviusMeet' || props.type === 'Transmisión' ? (
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
                      props.type === 'EviusMeet' || props.type === 'Transmisión'
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
              author={
                <Typography.Text style={{ fontSize: '20px' }} strong>
                  {props.activityName}
                </Typography.Text>
              }
              content={
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
          </Col>

          {dataLive?.live && dataLive?.active ? (
            dataLive?.live ? (
              <Col span={8}>
                <Badge count={recordings && Object.keys(recordings).length > 0 ? Object.keys(recordings).length : 0}>
                  {record === 'start' ? (
                    <Button
                      loading={loadingRecord}
                      onClick={() => {
                        startRecordTransmition();
                      }}
                      type='primary'>
                      Iniciar grabación
                    </Button>
                  ) : (
                    <Popconfirm
                      title='¿Está seguro que desea detener la grabación?'
                      okText='Si'
                      cancelText='No'
                      onConfirm={() => {
                        stopRecordTransmition();
                      }}
                      onCancel={() => console.log('cancelado')}>
                      <Button loading={loadingRecord} type='primary' danger>
                        Detener grabación
                      </Button>
                    </Popconfirm>
                  )}
                </Badge>
              </Col>
            ) : (
              loadingRecord && <Spin />
            )
          ) : null}
        </Row>

        {(props.type === 'Transmisión' ||
          props.type === 'vimeo' ||
          props.type == 'Youtube' ||
          props.type == 'EviusMeet') && (
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
          (props.type !== 'Transmisión' && props.type !== 'EviusMeet' && props.type !== 'reunión')) && (
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
              {props.type === 'Video' && <Select.Option value='no_visibe'>Oculto</Select.Option>}
            </Select>
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default CardPreview;
