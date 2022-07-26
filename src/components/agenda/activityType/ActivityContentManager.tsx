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
    activityType,
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
    if (activityType)
      return translateActivityType(activityType);
    return null;
  }, [activityType]);

  return (
    <>
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <Affix offsetTop={80}>
          <></>
          {/* Here the viewer */}
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
