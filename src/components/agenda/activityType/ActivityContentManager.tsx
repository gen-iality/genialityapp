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
import useActivityType from '@context/activityType/hooks/useActivityType';
import AgendaContext from '@context/AgendaContext';
import { CurrentEventContext } from '@context/eventContext';
import { obtenerVideos } from '@/adaptors/gcoreStreamingApi';
import VideoPreviewerCard from './components/manager/VideoPreviewerCard';
import TransmitionStatusCard from './components/manager/TransmitionStatusCard';
import VideoListCard from './components/manager/VideoListCard';
import LoadingActivityType from './components/LoadingActivityType';
import TransmitionOptionsCard from './components/manager/TransmitionOptionsCard';
import ParticipantRequestsCard from './components/manager/ParticipantRequestsCard';
import RTMPCard from './components/manager/RTMPCard';
import ShareMeetLinkCard from './components/manager/ShareMeetLinkCard';
import GoToMeet from './components/manager/GoToMeet';
import { activityContentValues } from '@context/activityType/constants/ui';
import type { ActivityType } from '@context/activityType/types/activityType';
import ModalListRequestsParticipate from '../roomManager/components/ModalListRequestsParticipate';

import TriviaEdit from '../../trivia/edit';

export interface ActivityContentManagerProps {
  activityName: string,
  matchUrl: string,
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
    recordings,
    startRecordTransmition,
    stopRecordTransmition,
    request,
    loadingRecord,
    record,
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
    saveActivityContent,
    resetActivityType,
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
    meeting_id && !(['quiz', 'quizing', 'survey'].includes(activityContentType!)) && getVideoList();

    if (type !== 'EviusMeet') return;
    getRequestByActivity(refActivity);
  }, [type, meeting_id]);

  useEffect(() => {
    console.debug('ActivityContentManager - take:', activityContentType);
    console.debug('ActivityContentManager - with source =', contentSource)
    console.debug('ActivityContentManager - dataLive:', JSON.stringify(dataLive));
    console.debug('ActivityContentManager - roomStatus:', JSON.stringify(roomStatus));
    console.debug('ActivityContentManager - platform:', JSON.stringify(platform));
  }, []);

  if (!type) {
    return (
      <Typography.Title>Tipo de contenido no soportado aún</Typography.Title>
    );
  }

  if ([activityContentValues.survey, activityContentValues.quizing].includes(activityContentType as ActivityType.ContentValue)) {
    return (
      <>
      <div style={{textAlign: 'center', width: '100%'}}>
        <Typography.Title>{activityContentType}</Typography.Title>
        <Typography.Text>Página de configuración del contenido.</Typography.Text>
      </div>
      <TriviaEdit
        inserted
        savedSurveyId={contentSource}
        activityId={activityEdit}
        event={eventContext.value}
        matchUrl={props.matchUrl}
        onSave={(surveyId: string) => {
          console.debug('call onSave from TriviaEdit. surveyId will be', surveyId);
          saveActivityContent(activityContentType as ActivitySubTypeName, surveyId);
        }}
        onDelete={() => {
          console.debug('survey delete')
          switch (activityContentType as ActivitySubTypeName) {
            case 'survey':
              resetActivityType('survey2');
              break;
            case 'quizing':
              resetActivityType('quizing2');
              break;
            default:
              console.error('Cant reset activity type from content type:', activityContentType);
          }
          // saveActivityContent(activityContentType as ActivitySubTypeName, null);
        }}
      />
      </>
    );
  }

  return (
    <>
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <Affix offsetTop={80}>
          <VideoPreviewerCard type={type} activityName={props.activityName} />
        </Affix>
      </Col>

      <Col span={14}>
        <Row gutter={[16, 16]}>
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
              <GoToMeet type={type} activityId={activityEdit} />
            </Col>
          )}

          {(((type === 'EviusMeet' || type === 'Transmisión') && dataLive?.active) || (type !== 'EviusMeet' && type !== 'Transmisión')) && (
            <Col span={type !== 'EviusMeet' && type !== 'reunión' ? 24 : 14}>
              <TransmitionOptionsCard type={type} />
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
              <ShareMeetLinkCard activityId={activityEdit} />
            </Col>
          ) : (
            type == 'EviusMeet' && dataLive?.active && (
              <Col span={24}>
                <ShareMeetLinkCard activityId={activityEdit} />
              </Col>
            )
          )}

          {type == 'EviusMeet' && dataLive?.active && (
            <Col span={24}>
              <ParticipantRequestsCard request={request} setViewModal={setViewModal} />
            </Col>
          )}

          {(type == 'Transmisión' || type == 'EviusMeet') && dataLive?.active && (
            <Col span={24}><RTMPCard/></Col>
          )}
        </Row>
      </Col>
    </Row>
    <ModalListRequestsParticipate handleModal={setViewModal} visible={viewModal} refActivity={refActivity}/>
    </>
  );
}

export default ActivityContentManager;
