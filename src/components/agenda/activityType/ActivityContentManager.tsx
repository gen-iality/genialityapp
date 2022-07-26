import * as React from 'react';
import { useState, useContext } from 'react';

import {
  Row,
  Col,
  Affix,
} from 'antd';
import useActivityType from '@/context/activityType/hooks/useActivityType';
import AgendaContext from '@/context/AgendaContext';

export interface ActivityContentManagerProps {};

function ActivityContentManager(props: ActivityContentManagerProps) {
  const {
    contentSource,
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
