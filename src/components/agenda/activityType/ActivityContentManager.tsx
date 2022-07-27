import * as React from 'react';
import { useState, useContext, useMemo, useEffect } from 'react';

import {
  Row,
  Col,
  Affix,
  Card,
  Typography,
  Statistic,
} from 'antd';
import useActivityType from '@/context/activityType/hooks/useActivityType';
import AgendaContext from '@/context/AgendaContext';
import { CurrentEventContext } from '@/context/eventContext';
import { obtenerVideos } from '@/adaptors/gcoreStreamingApi';
import VideoPreviewerCard from './components/manager/VideoPreviewerCard';
import TransmitionStatusCard from './components/manager/TransmitionStatusCard';
import VideoListCard from './components/manager/VideoListCard';
import LoadingActivityType from './components/LoadingActivityType';
import GoToEviusMeet from '../typeActivity/components/GoToEviusMeet';
import TransmitionOptionsCard from './components/manager/TransmitionOptionsCard';
import CardShareLinkEviusMeet from '../typeActivity/components/CardShareLinkEviusMeet';
import CardParticipantRequests from '../typeActivity/components/CardParticipantRequests';
import CardRTMP from '../typeActivity/components/CardRTMP';

export interface ActivityContentManagerProps {
  activityName: string,
};

function ActivityContentManager(props: ActivityContentManagerProps) {
  const eventContext = useContext(CurrentEventContext);
  const {
    activityEdit,
    roomStatus,
    setRoomStatus,
    dataLive,
    meeting_id,
    obtainUrl,
    getRequestByActivity,
    getViewers,
    recordings,
    startRecordTransmition,
    stopRecordTransmition,
    request,
    loadingRecord,
    record,
    viewers,
    viewersOnline,
    totalViews,
    maxViewers,
    platform,
  } = useContext(AgendaContext);

  const [viewModal, setViewModal] = useState(false);
  const [videos, setVideos] = useState<any[] | null>(null);

  const refActivity = useMemo(() => (
    `request/${eventContext.value?._id}/activities/${activityEdit}`), [eventContext, activityEdit]);
  const refActivityViewers = useMemo(() => (
    `viewers/${eventContext.value?._id}/activities/${activityEdit}`), [eventContext, activityEdit]);

  const {
    contentSource,
    translateActivityType,
    activityContentType,
  } = useActivityType();

  const type = useMemo(() => {
    if (activityContentType)
      return translateActivityType(activityContentType);
    return null;
  }, [activityContentType]);

  const videoURL = useMemo(() => {
    if (type !== 'Video') return contentSource;
    if (contentSource?.includes('youtube')) {
      return contentSource;
    }
    return contentSource?.split('*')[0];
  }, [type, contentSource]);

  const getVideoList = async () => {
    setVideos(null);
    const videoList = await obtenerVideos(props.activityName, meeting_id);
    if (videoList) {
      setVideos(videoList);
    }
  };

  useEffect(() => {
    meeting_id && getVideoList();

    if (type !== 'EviusMeet') return;
    getRequestByActivity(refActivity);
  }, [type, meeting_id]);

  useEffect(() => {
    getViewers(refActivityViewers);
  }, []);

  return (
    <>
    <pre>
      Take: {activityContentType}, with source={contentSource}.<br/>
      dataLive: {JSON.stringify(dataLive)}<br/>
      roomStatus: {JSON.stringify(roomStatus)}<br/>
      platform: {JSON.stringify(platform)}<br/>
    </pre>
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <Affix offsetTop={80}>
          {type && <VideoPreviewerCard type={type} activityName={props.activityName} />}
        </Affix>
      </Col>

      <Col span={14}>
        <Row gutter={[16, 16]}>
          <p>"{type}"</p>
          {(type == 'Transmisión' || type == 'EviusMeet') && !dataLive?.active && (
            <Col span={24}>
              <TransmitionStatusCard type={type} />
            </Col>
          )}

          {(type === 'Transmisión' || type === 'EviusMeet') &&
            !dataLive?.active &&
            (videos ? (
              <Col span={24}>
                <VideoListCard
                  refreshData={getVideoList}
                  videos={videos}
                  toggleActivitySteps={() => console.log('¿esto cuándo se usa?')}
                />
              </Col>
            ) : (
              <Col span={24}>
                <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                  <LoadingActivityType />
                </Card>
              </Col>
            ))}
          

          {(type == 'reunión' || (type == 'EviusMeet' && dataLive?.active)) && (
            <Col span={10}>
              <GoToEviusMeet type={type} activityId={activityEdit} />
            </Col>
          )}

          {(((type === 'EviusMeet' || type === 'Transmisión') && dataLive?.active) || (type !== 'EviusMeet' && type !== 'Transmisión')) && (
            <Col span={type !== 'EviusMeet' && type !== 'reunión' ? 24 : 14}>
              {type && <TransmitionOptionsCard type={type} />}
            </Col>
          )}

          {type == 'Video' && (
            <Col span={24}>
              <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                <Card.Meta
                  title={
                    <Typography.Text style={{ fontSize: '20px' }} strong>
                      Video cargado
                    </Typography.Text>
                  }
                  description={'Esta es la url cargada'}
                />
                <br /><strong>URL:</strong>{' '}{videoURL}
              </Card>
            </Col>
          )}

          {type == 'reunión' ? (
            <Col span={24}>
              <CardShareLinkEviusMeet activityId={activityEdit} />
            </Col>
          ) : (
            type == 'EviusMeet' && dataLive?.active && (
              <Col span={24}>
                <CardShareLinkEviusMeet activityId={activityEdit} />
              </Col>
            )
          )}

          {type == 'EviusMeet' && dataLive?.active && (
            <Col span={24}>
              <CardParticipantRequests request={request} setViewModal={setViewModal} />
            </Col>
          )}

          {(type == 'Transmisión' || type == 'EviusMeet') && dataLive?.active && (
            <Col span={24}><CardRTMP /></Col>
          )}

          {(!!roomStatus || type === 'reunión' || type === 'Video') && (
            <Col span={24}>
              <Card bodyStyle={{ padding: '21px' }} style={{ borderRadius: '8px' }}>
                <Card.Meta
                  title={
                    <Typography.Text style={{ fontSize: '20px' }} strong>
                      Estadísticas de la actividad
                    </Typography.Text>
                  }
                />
                <br />
                <Row gutter={[16, 16]} wrap>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<Typography.Text strong>Número de vistas totales</Typography.Text>}
                      value={totalViews.length}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <Statistic
                      style={{
                        textAlign: 'center',
                      }}
                      title={<Typography.Text strong>Número de usuarios únicos</Typography.Text>}
                      value={viewers.length}
                    />
                  </Col>

                  {(roomStatus === 'open_meeting_room' || type === 'reunión' || type === 'Video') && (
                    <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                      <Statistic
                        style={{ textAlign: 'center' }}
                        title={<Typography.Text strong>Visualizaciones en curso</Typography.Text>}
                        value={viewersOnline.length}
                      />
                    </Col>
                  )}
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <Statistic
                      style={{ textAlign: 'center' }}
                      title={<Typography.Text strong>Numero maximo de usuarios</Typography.Text>}
                      value={maxViewers || 0}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
    </>
  );
}

export default ActivityContentManager;
