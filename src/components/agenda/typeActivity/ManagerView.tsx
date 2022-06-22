import { Row, Col, Card, Typography, List, Spin, Affix } from 'antd';
import CardPreview from '../typeActivity/components/CardPreview';
import GoToEviusMeet from './components/GoToEviusMeet';
import TransmitionOptions from './components/TransmitionOptions';
import CardShareLinkEviusMeet from './components/CardShareLinkEviusMeet';
import CardParticipantRequests from './components/CardParticipantRequests';
import CardRTMP from './components/CardRTMP';
import CardStartTransmition from './components/CardStartTransmition';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';
import { useState, useContext, useEffect } from 'react';
import AgendaContext from '../../../context/AgendaContext';
import { CurrentEventContext } from '../../../context/eventContext';
import ModalListRequestsParticipate from '../roomManager/components/ModalListRequestsParticipate';
import { obtenerVideos } from '@/adaptors/gcoreStreamingApi';
import CardListVideo from './components/CardListVideo';
import LoadingTypeActivity from './components/LoadingTypeActivity';
import { fireRealtime } from '@/helpers/firebase';
const ManagerView = (props: any) => {
  const eventContext = useContext(CurrentEventContext);
  const { data, toggleActivitySteps } = useTypeActivity();
  const {
    activityEdit,
    getViewers,
    getRequestByActivity,
    request,
    dataLive,
    roomStatus,
    meeting_id,
    typeActivity,
    maxViewers,
    viewersOnline,
  } = useContext(AgendaContext);
  const [viewModal, setViewModal] = useState(false);
  const refActivity = `request/${eventContext.value?._id}/activities/${activityEdit}`;
  const refActivityViewers = `viewers/${eventContext.value?._id}/activities/${activityEdit}`;
  const [videos, setVideos] = useState<any[] | null>(null);
  useEffect(() => {
    meeting_id && obtenerListadodeVideos();
    getViewers(refActivityViewers);
    if (props.type !== 'EviusMeet') return;
    getRequestByActivity(refActivity);
  }, [props.type, meeting_id]);

  useEffect(() => {
    if (maxViewers < viewersOnline.length) {
      fireRealtime.ref(refActivityViewers + '/maxViewers').set(viewersOnline.length);
    }
  }, [viewersOnline]);

  const obtenerListadodeVideos = async () => {
    setVideos(null);
    const listVideos = await obtenerVideos(props.activityName, meeting_id);
    if (listVideos) {
      setVideos(listVideos);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <Affix offsetTop={80}>
            <CardPreview type={props.type} activityName={props.activityName} />
          </Affix>
        </Col>

        <Col span={14}>
          <Row gutter={[16, 16]}>
            {(props.type == 'Transmisión' || props.type == 'EviusMeet') && !dataLive?.active && (
              <Col span={24}>
                <CardStartTransmition type={props.type} />
              </Col>
            )}

            {(props.type === 'EviusMeet' || props.type === 'Transmisión') &&
              !dataLive?.active &&
              (videos ? (
                <Col span={24}>
                  <CardListVideo
                    refreshData={obtenerListadodeVideos}
                    videos={videos}
                    toggleActivitySteps={toggleActivitySteps}
                  />
                </Col>
              ) : (
                <Col span={24}>
                  <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                    <LoadingTypeActivity />
                  </Card>
                </Col>
              ))}
          </Row>
          <Row gutter={[16, 16]}>
            {(props.type == 'reunión' || (props.type == 'EviusMeet' && dataLive?.active)) && (
              <Col span={10}>
                <GoToEviusMeet type={props.type} activityId={props.activityId} />
              </Col>
            )}
            {(((props.type === 'EviusMeet' || props.type === 'Transmisión') && dataLive?.active) ||
              (props.type !== 'EviusMeet' && props.type !== 'Transmisión')) && (
              <Col span={props.type !== 'EviusMeet' && props.type !== 'reunión' ? 24 : 14}>
                <TransmitionOptions type={props.type} />
              </Col>
            )}
            {props.type == 'Video' && (
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
                  <br />
                  <strong>Url:</strong>{' '}
                  {props.type == 'Video' ? (data?.includes('youtube') ? data : data?.split('*')[0]) : data}
                </Card>
              </Col>
            )}
            {props.type == 'reunión' ? (
              <Col span={24}>
                <CardShareLinkEviusMeet activityId={props.activityId} />
              </Col>
            ) : (
              props.type == 'EviusMeet' &&
              dataLive?.active && (
                <Col span={24}>
                  <CardShareLinkEviusMeet activityId={props.activityId} />
                </Col>
              )
            )}
            {props.type == 'EviusMeet' && dataLive?.active && (
              <Col span={24}>
                <CardParticipantRequests request={request} setViewModal={setViewModal} />
              </Col>
            )}
            {(props.type == 'Transmisión' || props.type == 'EviusMeet') && dataLive?.active && (
              <Col span={24}>
                <CardRTMP />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      <ModalListRequestsParticipate refActivity={refActivity} visible={viewModal} handleModal={setViewModal} />
    </>
  );
};

export default ManagerView;
