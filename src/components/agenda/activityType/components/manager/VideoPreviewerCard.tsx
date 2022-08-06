import * as React from 'react';
import { useMemo } from 'react';

import {
  Card,
  Typography,
  Space,
  Select,
  Avatar,
  Button,
  Spin,
  Comment,
  Row,
  Col,
  Badge,
  Popconfirm,
  Result,
  Statistic,
} from 'antd';
import ReactPlayer from 'react-player';
import { CheckCircleOutlined, StopOutlined, YoutubeFilled } from '@ant-design/icons';
import useActivityType from '@/context/activityType/hooks/useActivityType';
import { useContext, useEffect, useState } from 'react';
import AgendaContext from '@/context/AgendaContext';
import VimeoIcon from '@2fd/ant-design-icons/lib/Vimeo';
import EmoticonSadOutline from '@2fd/ant-design-icons/lib/EmoticonSadOutline';
import { startRecordingLiveStream, stopRecordingLiveStream } from '@/adaptors/gcoreStreamingApi';
import { urlErrorCodeValidation } from '@/Utilities/urlErrorCodeValidation';
import type { ActivityType } from '@/context/activityType/types/activityType';
import convertSecondsToHourFormat from '../../utils/convertSecondsToHourFormat';

interface VideoPreviewerCardProps {
  type: ActivityType.TypeAsDisplayment,
  activityName: string,
};

const VideoPreviewerCard = (props: VideoPreviewerCardProps) => {
  const [duration, setDuration] = useState(0);
  const [errorOcurred, setErrorOcurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let {
    contentSource: data,
  } = useActivityType();
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
    viewers,
    viewersOnline,
    totalViews,
    maxViewers,
    saveConfig,
  } = useContext(AgendaContext);

  console.debug('VideoPreviewerCard.dataLive:', dataLive);

  if (!data) data = meeting_id;

  // Render the ifram or gCore component
  const renderPlayer = () => {
    // Gets visibility status for the react player, and the url to render
    if (!data) return (
      <><Spin/><p>Esperando recurso...</p></>
    );
    const { urlVideo, visibleReactPlayer } = obtainUrl(props.type, data);

    return (
      <>
        {errorOcurred ? (
          <Result
            status='info'
            title='Lo sentimos'
            subTitle={
              errorMessage === 'An error occurred.'
                ? errorMessage
                : `Hubo un error al procesar el video, posiblemente se ha movido el recurso o ha sido borrado.`
            }
            icon={<EmoticonSadOutline />}
          />
        ) : (
          <>
            {visibleReactPlayer && (
              // @ts-expect-error
              <ReactPlayer
                playing={true}
                loop={true}
                onDuration={props.type === 'Video' ? handleDuration : undefined}
                style={{ objectFit: 'cover', aspectRatio: '16/9' }}
                width='100%'
                height='100%'
                url={urlVideo}
                controls={true}
                onError={(e) => {
                  if (props.type !== 'EviusMeet' && props.type !== 'Transmisión') {
                    setErrorOcurred(true);
                    setErrorMessage(e?.message);
                  }
                }}
              />
            )}
          </>
        )}

        {!visibleReactPlayer && !errorOcurred && (
          <iframe
            style={{ aspectRatio: '16/9' }}
            width='100%'
            src={urlVideo + '?muted=1&autoplay=1'}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            onLoad={(e) => {
              if (props.type !== 'EviusMeet' && props.type !== 'Transmisión') {
                // @ts-expect-error
                setErrorOcurred(urlErrorCodeValidation(e.target?.src, true));
              }
            }}></iframe>
        )}
      </>
    );
  };

  console.debug('VideoPreviewerCard (99. data transmition):', dataLive?.live, dataLive?.hls_playlist_url);

  // Check IDs to split the YouTube or Vimeo URL
  const filterData = useMemo(() => {
    if (data) {
      if (data.toString().includes('https://vimeo.com/event/') || data.toString().includes('https://youtu.be/'))
        return data?.split('/')[data?.split('/').length - 1]
      return data;
    } else if (meeting_id) {
      return meeting_id;
    }
    return null;
  }, [meeting_id, data]);

  const handleDuration = (duration: number) => {
    console.debug('VideoPreviewerCard::onDuration:', duration);
    setDuration(duration);
  };

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
                  convertSecondsToHourFormat(duration)
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
                tooltips: ['clic para copiar', '¡ID copiado!'],
                text: `${filterData}`,
              }}>
              {filterData}
            </Typography.Text>
          </Space>
        )}
        {((dataLive?.active && (props.type === 'Transmisión' || props.type === 'EviusMeet')) ||
          (props.type !== 'Transmisión' && props.type !== 'EviusMeet' && props.type !== 'reunión' && props.type !== 'Video')) && (
          <Space direction='vertical' style={{ width: '100%' }}>
            <Typography.Text strong>Estado de la actividad para tus asistentes: </Typography.Text>
            <Select
              value={roomStatus}
              onChange={(value) => {
                console.debug('saves value of RoomStatus:', value);
                setRoomStatus(value);
                saveConfig({ habilitar_ingreso: value })
                  .then(() => console.log('config saved - habilitar_ingreso:', value));
              }}
              style={{ width: '100%' }}>
              <Select.Option value='created_meeting_room'>Actividad creada</Select.Option>
              <Select.Option value='closed_meeting_room'>Iniciará pronto</Select.Option>
              <Select.Option value='open_meeting_room'>En vivo</Select.Option>
              <Select.Option value='ended_meeting_room'>Finalizada</Select.Option>
            </Select>
          </Space>
        )}
        {/* {(roomStatus != '' || props.type === 'reunión' || props.type === 'Video') && (
          <Space direction='vertical'>
            <Typography.Text strong>Estadisticas de la actividad:</Typography.Text>
            <Typography.Text strong>Número de vistas totales: {totalViews.length}</Typography.Text>
            <Typography.Text strong>Número de Usuarios unicos: {viewers.length}</Typography.Text>
            {(roomStatus === 'open_meeting_room' || props.type === 'reunión' || props.type === 'Video') && (
              <Typography.Text strong>Visualizaciones en curso: {viewersOnline.length}</Typography.Text>
            )}
            <Typography.Text strong>Numero maximo de usuarios: {maxViewers ? maxViewers : 0}</Typography.Text>
          </Space>
        )} */}
      </Space>
    </Card>
  );
};

export default VideoPreviewerCard;
