import * as React from 'react';
import { useState, useContext, useMemo } from 'react';

import {
  Row,
  Col,
  Affix,
} from 'antd';
import useActivityType from '@/context/activityType/hooks/useActivityType';
import AgendaContext from '@/context/AgendaContext';
import VideoPreviewerCard from './components/manager/VideoPreviewerCard';
import TransmitionStatusCard from './components/manager/TransmitionStatusCard';

export interface ActivityContentManagerProps {
  activityName: string,
};

function ActivityContentManager(props: ActivityContentManagerProps) {
  const {
    contentSource,
    translateActivityType,
    activityContentType,
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
  } = useContext(AgendaContext);

  const type = useMemo(() => {
    if (activityContentType)
      return translateActivityType(activityContentType);
    return null;
  }, [activityContentType]);

  return (
    <>
    <pre>Take: {activityContentType}, with source={contentSource}. {JSON.stringify(dataLive)}</pre>
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <Affix offsetTop={80}>
          {type && <VideoPreviewerCard type={type} activityName={props.activityName} />}
        </Affix>
      </Col>

      <Col span={14}>
        <Row gutter={[16, 16]}>
          <></>
        </Row>
      </Col>
    </Row>
    </>
  );
}

export default ActivityContentManager;
